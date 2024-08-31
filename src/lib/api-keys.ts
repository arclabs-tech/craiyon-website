const apiKeys: string[] = [
  "1d7dfe54-1aba-4564-b5de-4b1d43d96a05",
  "ad89e589-9eac-4721-a1de-dd5b37a23d9d",
  "dd8c2e8b-2aa6-48bf-8f1c-c48b9f5910c5",
  "d2da0000-a5da-47be-8ab3-41a88a2ae5ad",
  "d277ef6d-5433-42b4-b514-dff1bad3dc53",
  "467b33e8-8a73-4f7b-89f6-44928d8e0659",
  "f94536f6-5b77-4729-90cb-e177e993ec70",
  "c4523019-31dc-48d1-b93a-47b712b93719",
  "924e9cd2-b5d6-4679-8eb4-d4899b4d2e7d",
  "430ebe26-941c-4530-8e52-90c8cebe32c8",
  "e053c725-9f29-4d98-b0c5-c9c33a51ccc5",
  "76cf1e97-8a2c-46f4-a8c7-ea1f2b9f7044",
  "b2fb9a12-87f7-4f97-b433-d29f307229bd",
  "9daeb4ad-1289-4572-a768-a2508a893c5e",
  "4df0e348-9a48-4536-8ad8-1c7774cbd082",
  "f99492ac-b25d-4959-bb1a-69ea49dd65f2",
  "d3a60b21-182e-4160-82b6-23a20c90d3b6",
  "77847148-9835-48b9-99cb-fc39205790f5",
  "52b5e7af-6be5-4ac4-b75b-de091dc75691",
  "0380f744-a66f-483c-8c6a-61a2be9756fe",
  "87bcc173-85ce-4656-afa7-47740bd5ffe3",
  "a9a04d51-7912-45a4-82a7-ffb152b8279e",
];

export const GetApiKey = () =>
  apiKeys[Math.floor(Math.random() * apiKeys.length)];
