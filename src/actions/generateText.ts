"use server";

import OpenAI from "openai";
import { type TextOpts } from "@/lib/schemas";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateText(opts: TextOpts) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: opts.system_prompt,
      },
      {
        role: "user",
        content: opts.user_prompt,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    temperature: opts.temperature[0],
    max_tokens: opts.max_tokens,
  });
  const generation = completion.choices[0].message.content;
  return generation;
}

export async function getEmbedding(text: string) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
    encoding_format: "float",
  });
  const embedding = response.data[0].embedding;
  return Float32Array.from(embedding);
}
