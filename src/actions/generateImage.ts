"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";
import { GetApiKey } from "@/lib/api-keys";

type ImageGenerationResponse = {
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
  id: string;
};

async function generateImage(opts: ImageOpts) {
  const url = "https://api.studio.nebius.com/v1/images/generations";
  const apiKey = GetApiKey();

  // Build request body with only supported parameters
  const body: any = {
    model: opts.model,
    prompt: opts.prompt,
    width: opts.width,
    height: opts.height,
    response_format: "url",
  };

  // Add optional parameters only if they have valid values
  if (opts.negative_prompt && opts.negative_prompt.trim() !== "") {
    body.negative_prompt = opts.negative_prompt;
  }
  
  if (opts.steps && opts.steps[0] && opts.steps[0] > 0) {
    body.num_inference_steps = opts.steps[0];
  }
  
  if (opts.guidance_scale && opts.guidance_scale[0] && opts.guidance_scale[0] > 0) {
    body.guidance_scale = opts.guidance_scale[0];
  }
  
  if (opts.seed && opts.seed > -1) {
    body.seed = opts.seed;
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

    return { imageUrl: data.data[0].url };
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
