"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";

type NebiusImageResponse = {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
  id: string;
};

async function generateImage(opts: ImageOpts) {
  const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || opts.api_key;
  
  const body = {
    model: "black-forest-labs/FLUX.1-schnell",
    prompt: opts.prompt,
    width: opts.width,
    height: opts.height,
    num_inference_steps: opts.steps[0],
    guidance_scale: opts.cfg_scale[0],
    seed: opts.seed === -1 ? Math.floor(Math.random() * 1000000) : opts.seed,
    negative_prompt: opts.negative_prompt || "",
    response_format: "url"
  };

  const { data, status } = await axios.post<NebiusImageResponse>(
    "https://api.studio.nebius.ai/v1/images/generations",
    body,
    {
      headers: {
        "Authorization": `Bearer ${NEBIUS_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to generate image`);

  return data;
}

async function getImageUrl(nebiusResponse: NebiusImageResponse, apiKey: string): Promise<string> {
  // Nebius API returns the image URL directly in the response
  if (nebiusResponse.data && nebiusResponse.data.length > 0 && nebiusResponse.data[0].url) {
    return nebiusResponse.data[0].url;
  } else {
    throw new Error("No image URL found in Nebius response");
  }
}

async function getBase64Image(imageUrl: string) {
  const { data, status } = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to get image data`);

  const base64 = Buffer.from(data, "binary").toString("base64");
  return base64;
}

async function getEmbedding(imageData: string): Promise<Float32Array> {
  const { data, status } = await axios.post(
    "https://62etifevx7ft3i72nmavnfsrsu0thgvs.lambda-url.us-east-1.on.aws/",
    {
      img: imageData,
      dims: 256,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to get image embedding`);

  return new Float32Array(data.embedding);
}

export { generateImage, getImageUrl, getBase64Image, getEmbedding };
