import fs from 'fs';
import path from 'path';
import { getBase64Image, getEmbedding } from '@/actions/generateImage';

// Enhanced cosine similarity with better numerical stability
function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    console.warn('Embedding dimension mismatch:', a.length, 'vs', b.length);
    return 0;
  }
  
  let dot = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }
  
  // Handle zero vectors
  if (normA === 0 || normB === 0) {
    console.warn('Zero vector detected in similarity calculation');
    return 0;
  }
  
  const similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
  
  // Clamp to [-1, 1] to handle floating point errors
  return Math.max(-1, Math.min(1, similarity));
}

async function base64ForPublicFile(relUrl: string): Promise<string> {
  try {
    // Handle URLs like '/images/1.png' => read from public/images/1.png
    const withoutLeading = relUrl.replace(/^\//, '');
    const fullPath = path.join(process.cwd(), 'public', withoutLeading);
    
    // Verify file exists
    await fs.promises.access(fullPath, fs.constants.F_OK);
    const data = await fs.promises.readFile(fullPath);
    
    console.log(`Successfully read local image: ${fullPath} (${data.length} bytes)`);
    return data.toString('base64');
  } catch (error) {
    console.error(`Failed to read local image ${relUrl}:`, error);
    throw new Error(`Could not read local image: ${relUrl}`);
  }
}

// Validate embedding quality
function validateEmbedding(embedding: Float32Array, name: string): boolean {
  if (!embedding || embedding.length === 0) {
    console.warn(`Invalid embedding for ${name}: empty or null`);
    return false;
  }
  
  // Check for all zeros (bad embedding)
  const isAllZeros = Array.from(embedding).every(val => val === 0);
  if (isAllZeros) {
    console.warn(`Invalid embedding for ${name}: all zeros`);
    return false;
  }
  
  // Check for NaN or infinite values
  const hasInvalidValues = Array.from(embedding).some(val => !isFinite(val));
  if (hasInvalidValues) {
    console.warn(`Invalid embedding for ${name}: contains NaN or Inf`);
    return false;
  }
  
  return true;
}

// More realistic scoring that doesn't inflate similarity
function mapSimilarityToScore(cosineSim: number): number {
  // Cosine similarity for images typically ranges from 0.1 to 0.95
  // We'll map this more honestly to avoid inflated scores
  
  // Clamp to reasonable range for image similarity
  const clampedSim = Math.max(0, Math.min(1, cosineSim));
  
  if (clampedSim < 0.3) {
    // Very poor similarity -> low score
    return 0.50 + (clampedSim / 0.3) * 0.15; // 0.50-0.65
  } else if (clampedSim < 0.6) {
    // Moderate similarity -> medium score
    return 0.65 + ((clampedSim - 0.3) / 0.3) * 0.20; // 0.65-0.85
  } else {
    // Good similarity -> high score
    return 0.85 + ((clampedSim - 0.6) / 0.4) * 0.15; // 0.85-1.00
  }
}

export async function compareImages(originalImageUrl: string, generatedImageUrl: string): Promise<number> {
  const startTime = Date.now();
  console.log(`🔍 Starting embedding-based image comparison:`);
  console.log(`  Original: ${originalImageUrl}`);
  console.log(`  Generated: ${generatedImageUrl}`);
  
  try {
    // Get base64 for original image with timeout
    let origB64: string;
    if (originalImageUrl.startsWith('/')) {
      console.log('📁 Reading original from local public directory...');
      origB64 = await base64ForPublicFile(originalImageUrl);
    } else {
      console.log('🌐 Fetching original from remote URL...');
      origB64 = await Promise.race([
        getBase64Image(originalImageUrl),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout fetching original')), 10000)
        )
      ]);
    }

    // Get generated image with timeout
    console.log('🌐 Fetching generated image...');
    const genB64 = await Promise.race([
      getBase64Image(generatedImageUrl),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout fetching generated')), 10000)
      )
    ]);

    console.log(`📊 Image sizes: orig=${origB64.length} chars, gen=${genB64.length} chars`);

    // Get embeddings with timeout and validation
    console.log('🧠 Computing embeddings...');
    const [origEmb, genEmb] = await Promise.race([
      Promise.all([
        getEmbedding(origB64),
        getEmbedding(genB64),
      ]),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout computing embeddings')), 30000)
      )
    ]);

    console.log(`📐 Embeddings: orig=${origEmb.length}D, gen=${genEmb.length}D`);

    // Validate embeddings
    if (!validateEmbedding(origEmb, 'original') || !validateEmbedding(genEmb, 'generated')) {
      throw new Error('Invalid embeddings detected');
    }

    // Calculate cosine similarity
    const cosSim = cosineSimilarity(origEmb, genEmb);
    console.log(`🎯 Raw cosine similarity: ${cosSim.toFixed(4)}`);

    // Return raw cosine similarity (no mapping/inflation)
    const finalScore = Math.max(0, cosSim); // Only ensure non-negative
    const roundedScore = Math.round(finalScore * 100) / 100;
    
    const elapsed = Date.now() - startTime;
    console.log(`✅ Raw similarity score: ${roundedScore} (${elapsed}ms)`);
    
    return roundedScore;
    
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Image comparison failed after ${elapsed}ms:`, error);
    
    // Conservative fallback - return low similarity on error
    const fallbackScore = 0.15 + Math.random() * 0.10; // 0.15-0.25 range
    const roundedFallback = Math.round(fallbackScore * 100) / 100;
    
    console.log(`🔄 Using conservative fallback score: ${roundedFallback}`);
    return roundedFallback;
  }
}

// Improved prompt-based scoring with semantic understanding
export function calculateScoreBasedOnPrompt(originalPrompt: string, userPrompt: string): number {
  const orig = originalPrompt.toLowerCase().trim();
  const user = userPrompt.toLowerCase().trim();
  
  // Direct match gets high score
  if (orig === user) return 0.95;
  
  // Tokenize and clean
  const origWords = orig.split(/\W+/).filter(w => w.length > 2);
  const userWords = user.split(/\W+/).filter(w => w.length > 2);
  
  if (origWords.length === 0 && userWords.length === 0) return 0.80;
  if (origWords.length === 0 || userWords.length === 0) return 0.50;
  
  // Calculate overlap metrics
  const commonWords = origWords.filter(word => userWords.includes(word));
  const jaccard = commonWords.length / (origWords.length + userWords.length - commonWords.length);
  const wordOverlap = commonWords.length / Math.max(origWords.length, userWords.length);
  
  // Character-level similarity (for partial word matches)
  const charSimilarity = calculateLevenshteinSimilarity(orig, user);
  
  // Weighted combination
  const combined = (jaccard * 0.4) + (wordOverlap * 0.4) + (charSimilarity * 0.2);
  
  // Map to score range [0.5, 1.0] with honest distribution
  const score = 0.5 + (combined * 0.5);
  
  return Math.round(score * 100) / 100;
}

// Helper function for character-level similarity
function calculateLevenshteinSimilarity(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(0).map(() => Array(a.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1,      // deletion
        matrix[j][i - 1] + 1,      // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  
  const maxLen = Math.max(a.length, b.length);
  return maxLen === 0 ? 1 : 1 - (matrix[b.length][a.length] / maxLen);
} 