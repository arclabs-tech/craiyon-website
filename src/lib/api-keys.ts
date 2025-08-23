// Get API keys from environment variables or use hardcoded key
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
  
  // If no environment variables are set, use the hardcoded key
  return [
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExMDg0MDQ3NDk0MTA3NTA3NzA5MSIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkxMzYxODc1MiwidXVpZCI6IjgyMzQ1YmEyLTU1MTAtNDI0My1hMzZkLTZhMDkwNzM4Nzk5YyIsIm5hbWUiOiJjcmFpeW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDgtMjJUMDg6NDU6NTIrMDAwMCJ9.0qzaOZXKb0-_bX8sccBIhfNtJXOQk1-V0iKXPJv5s3Y"
  ];
}

const apiKeys: string[] = getApiKeysFromEnv();

export const GetApiKey = () =>
  apiKeys[Math.floor(Math.random() * apiKeys.length)];
