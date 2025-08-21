const apiKeys: string[] = [
  // Replace these with your actual Nebius API keys
  "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTk4NjIyMjc1MjYyNjI5NTYyOCIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTkxMzQ3MTcwOCwidXVpZCI6ImVkOGUyMjQxLWRlZmItNDQyYi1hMTExLTA4ZDBhYzdjNjcyYSIsIm5hbWUiOiJ0ZXN0IiwiZXhwaXJlc19hdCI6IjIwMzAtMDgtMjBUMTU6NTU6MDgrMDAwMCJ9.o2W9cdXrSbMqbya2AZu8QoTUiG8iFV9gchE-hXtbXzU"
  // "your-nebius-api-key-1",
  // "your-nebius-api-key-2", 
  // "your-nebius-api-key-3",
];

export const GetApiKey = () =>
  apiKeys[Math.floor(Math.random() * apiKeys.length)];
