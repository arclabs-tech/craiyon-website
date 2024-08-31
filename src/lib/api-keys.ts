const apiKeys: string[] = ["abc", "def"];

export const GetApiKey = () =>
  apiKeys[Math.floor(Math.random() * apiKeys.length)];
