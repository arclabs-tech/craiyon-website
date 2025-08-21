// Get API keys from environment variables
function getApiKeysFromEnv(): string[] {
  // First try to get multiple keys from NEBIUS_API_KEYS (comma-separated)
  const multipleKeys = process.env.NEBIUS_API_KEYS;
  if (multipleKeys) {
    return multipleKeys.split(',').map(key => key.trim()).filter(key => key.length > 0);
  }
  
  // Fallback to single key from NEBIUS_API_KEY
  const singleKey = process.env.NEBIUS_API_KEY;
  if (singleKey) {
    return [singleKey];
  }
  
  // If no environment variables are set, throw an error
  throw new Error(
    'No Nebius API key found. Please set NEBIUS_API_KEY or NEBIUS_API_KEYS in your environment variables.'
  );
}

const apiKeys: string[] = getApiKeysFromEnv();

export const GetApiKey = () =>
  apiKeys[Math.floor(Math.random() * apiKeys.length)];
