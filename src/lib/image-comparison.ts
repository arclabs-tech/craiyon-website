// Simple image comparison utility
// In a real implementation, you would use a proper image similarity API
// For now, we'll use a random score between 0.5 and 1.0 as requested

export function compareImages(originalImageUrl: string, generatedImageUrl: string): number {
  // In a real implementation, you would:
  // 1. Download both images
  // 2. Convert them to embeddings using a vision model
  // 3. Calculate cosine similarity or dot product
  // 4. Return the similarity score
  
  // For now, return a random score between 0.5 and 1.0 as requested
  const minScore = 0.5;
  const maxScore = 1.0;
  const score = Math.random() * (maxScore - minScore) + minScore;
  
  // Round to 2 decimal places
  return Math.round(score * 100) / 100;
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