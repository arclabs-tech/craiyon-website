import fs from 'fs';
import path from 'path';
import { getBase64Image, getEmbedding } from '@/actions/generateImage';

// Cache for embeddings to avoid recomputation
const embeddingCache = new Map<string, Float32Array>();

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

// Get embedding with retry logic and caching
async function getEmbeddingWithRetry(base64Data: string, name: string, maxRetries = 3): Promise<Float32Array> {
  // Create cache key from first 100 chars of base64 (enough to identify image)
  const cacheKey = base64Data.substring(0, 100);
  
  // Check cache first
  if (embeddingCache.has(cacheKey)) {
    console.log(`🎯 Using cached embedding for ${name}`);
    return embeddingCache.get(cacheKey)!;
  }
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🧠 Computing embedding for ${name} (attempt ${attempt}/${maxRetries})...`);
      
      const embedding = await Promise.race([
        getEmbedding(base64Data),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Embedding timeout after 20s`)), 20000)
        )
      ]);
      
      // Validate embedding
      if (!validateEmbedding(embedding, name)) {
        throw new Error(`Invalid embedding received for ${name}`);
      }
      
      // Cache successful result
      embeddingCache.set(cacheKey, embedding);
      console.log(`✅ Successfully computed and cached embedding for ${name}`);
      
      return embedding;
      
    } catch (error) {
      console.warn(`⚠️ Embedding attempt ${attempt}/${maxRetries} failed for ${name}:`, error);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to get embedding for ${name} after ${maxRetries} attempts: ${error}`);
      }
      
      // Wait before retry (exponential backoff)
      const waitTime = 1000 * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw new Error(`Exhausted all retry attempts for ${name}`);
}

// mapSimilarityToScore removed — scoring uses raw image-image cosine similarity only.

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

    // Get embeddings with retry and validation
    console.log('🧠 Computing embeddings with retry logic...');
    const [origEmb, genEmb] = await Promise.all([
      getEmbeddingWithRetry(origB64, 'original'),
      getEmbeddingWithRetry(genB64, 'generated'),
    ]);

    console.log(`📐 Embeddings: orig=${origEmb.length}D, gen=${genEmb.length}D`);

    // Calculate cosine similarity
    const cosSim = cosineSimilarity(origEmb, genEmb);
    console.log(`🎯 Raw cosine similarity: ${cosSim.toFixed(4)}`);

  // Return raw cosine similarity clamped to [0,1]
  const finalScore = Math.max(0, Math.min(1, cosSim));
  const roundedScore = Math.round(finalScore * 100) / 100;

  const elapsed = Date.now() - startTime;
  console.log(`✅ Raw similarity score: ${roundedScore} (${elapsed}ms)`);

  return roundedScore;
    
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Image comparison failed after ${elapsed}ms:`, error);
    
  // On error, return 0 (no optimistic/text fallback)
  console.log('🔄 Image comparison failed — returning 0 (no fallback)');
  return 0;
  }
}

// Improved prompt-based scoring with semantic understanding
// Prompt-based scoring helper removed — scoring is image-only now.