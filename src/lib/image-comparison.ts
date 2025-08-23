import fs from 'fs';
import path from 'path';
import { getBase64Image, getEmbedding } from '@/actions/generateImage';

// Compute cosine similarity between two Float32Array embeddings
function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function base64ForPublicFile(relUrl: string): Promise<string> {
  // relUrl like '/images/1.png' => read from public/images/1.png
  const withoutLeading = relUrl.replace(/^\//, '');
  const fullPath = path.join(process.cwd(), 'public', withoutLeading);
  const data = await fs.promises.readFile(fullPath);
  return data.toString('base64');
}

export async function compareImages(originalImageUrl: string, generatedImageUrl: string): Promise<number> {
  try {
    // Get base64 for original: local public asset or remote URL
    let origB64: string;
    if (originalImageUrl.startsWith('/')) {
      origB64 = await base64ForPublicFile(originalImageUrl);
    } else {
      origB64 = await getBase64Image(originalImageUrl);
    }

    // Generated is a remote URL from the model
    const genB64 = await getBase64Image(generatedImageUrl);

    // Get embeddings (Float32Array)
    const [origEmb, genEmb] = await Promise.all([
      getEmbedding(origB64),
      getEmbedding(genB64),
    ]);

    // Cosine similarity in [ -1, 1 ]; map to [0.5, 1.0] like before but based on actual similarity
    const cos = Math.max(-1, Math.min(1, cosineSimilarity(origEmb, genEmb)));
    const minScore = 0.5;
    const maxScore = 1.0;
    // Map [-1,1] -> [0,1] then to [0.5,1.0]
    const normalized = (cos + 1) / 2; // 0..1
    const score = minScore + normalized * (maxScore - minScore);
    return Math.round(score * 100) / 100;
  } catch (err) {
    console.error('Embedding comparison failed, falling back:', err);
    // Fallback: conservative mid score so system remains usable
    return 0.7;
  }
}

// Alternative: More sophisticated scoring based on prompt similarity
export function calculateScoreBasedOnPrompt(originalPrompt: string, userPrompt: string): number {
  // Simple keyword matching for now
  const originalWords = originalPrompt.toLowerCase().split(/\s+/);
  const userWords = userPrompt.toLowerCase().split(/\s+/);
  
  const commonWords = originalWords.filter(word => userWords.includes(word));
  const similarity = commonWords.length / Math.max(originalWords.length, userWords.length);
  
  // Convert to score between 0.5 and 1.0
  const minScore = 0.5;
  const maxScore = 1.0;
  const score = minScore + (similarity * (maxScore - minScore));
  
  return Math.round(score * 100) / 100;
} 