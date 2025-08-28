"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";
import { GetApiKey } from "@/lib/api-keys";
import { saveGeneratedImage } from "@/lib/database";


type ImageGenerationResponse = {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
  id: string;
};

type GenerateImageParams = {
  opts: ImageOpts | string;
  user: string;
};

async function generateImage({ opts, user }: GenerateImageParams) {
  const url = "https://api.studio.nebius.com/v1/images/generations";
  const apiKey = GetApiKey();

  // Handle both string prompt and ImageOpts object
  let prompt: string;
  let model: string;
  let width: number;
  let height: number;
  let negative_prompt: string = "nsfw,nudity,breasts,erotic,sex,porn,penis,vagina";
  let steps: number = 8;
  let guidance_scale: number = 7;
  let seed: number = -1;

  if (typeof opts === 'string') {
    // Simple string prompt - use defaults
    prompt = opts;
    model = "black-forest-labs/flux-schnell";
    width = 1024;
    height = 1024;
  } else {
    // ImageOpts object
    prompt = opts.prompt;
    model = opts.model;
    width = opts.width;
    height = opts.height;
    // negative_prompt = opts.negative_prompt || "nsfw,nudity,breasts,erotic,sex,porn,penis,vagina,";
    steps = opts.steps?.[0] || 8;
    guidance_scale = opts.guidance_scale?.[0] || 7;
    seed = opts.seed || -1;
  }

  // Build request body with required parameters
  const body: any = {
    model: model,
    prompt: prompt,
    width: width,
    height: height,
    response_format: "url",
  };

  // Add optional parameters only if they have valid values
  if (negative_prompt && negative_prompt.trim() !== "") {
    body.negative_prompt = negative_prompt;
  }
  
  if (steps > 0) {
    body.num_inference_steps = steps;
  }
  
  if (guidance_scale > 0) {
    body.guidance_scale = guidance_scale;
  }
  
  if (seed > -1) {
    body.seed = seed;
  }

  // Debug log to show the request being made
  console.log("🚀 Nebius API Request:", {
    url,
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey.substring(0, 20)}...`, // Truncated for security
      "Content-Type": "application/json",
    },
    body
  });

  try {
    const { data, status } = await axios.post<ImageGenerationResponse>(url, body, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    if (status !== 200)
      throw new Error(`Error ${status}: Failed to generate image`);

    if (!data.data || data.data.length === 0 || !data.data[0].url) {
      throw new Error("No image generated");
    }

  const imageUrl = data.data[0].url;
  // Save to database
  await saveGeneratedImage({ user, prompt, url: imageUrl });
  return imageUrl;
  } catch (error: any) {
    if (error.response) {
      // Log the full error response for debugging
      console.error("Nebius API Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      throw new Error(`API Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
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

export { generateImage, getBase64Image, getEmbedding };
