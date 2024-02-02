"use server";

import OpenAI from "openai";
import { type TextOpts } from "@/lib/schemas";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateText(opts: TextOpts) {
  if (opts.model == "gpt-3.5-turbo-1106") {
    return await generateTextGPT3(opts);
  } else if (opts.model == "llama-2-13b") {
    return await generateTextLlama(opts);
  }
}

async function generateTextGPT3(opts: TextOpts) {
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

async function generateTextLlama(opts: TextOpts) {
  const prompt = `
  [INST]
  <<SYS>>
  ${opts.system_prompt}
  <</SYS>>
  ${opts.user_prompt}
  [/INST]
  `;

  const { data, status } = await axios.post<{ generation: string }>(
    "https://abh4g3zbqx33mutjmi3o52jzzq0ndtft.lambda-url.us-east-1.on.aws/",
    {
      prompt: prompt,
      max_gen_len: opts.max_tokens,
      temperature: opts.temperature[0],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to get image embedding`);

  return data.generation;
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
