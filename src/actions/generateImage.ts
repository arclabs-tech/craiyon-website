"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";

type ResponseProps = {
  id: string;
  status: string;
  result?: {
    image_url: string;
  };
};

async function generateImage(opts: ImageOpts) {
  const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || opts.api_key;
  
  const body = {
    model: opts.model,
    prompt: opts.prompt,
    negative_prompt: opts.negative_prompt,
    steps: opts.steps[0],
    cfg_scale: opts.cfg_scale[0],
    seed: opts.seed === -1 ? Math.floor(Math.random() * 1000000) : opts.seed,
    width: opts.width,
    height: opts.height,
    sampler: opts.sampler,
  };

  const { data, status } = await axios.post<ResponseProps>(
    "https://api.studio.nebius.ai/v1/text-to-image/generate",
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

type GetImageUrlResponseProps = {
  id: string;
  status: string;
  result?: {
    image_url: string;
  };
};

async function getImageUrl(jobId: string, apiKey: string): Promise<string> {
  const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY || apiKey;
  
  const { data: job, status } = await axios.get<GetImageUrlResponseProps>(
    `https://api.studio.nebius.ai/v1/text-to-image/status/${jobId}`,
    {
      headers: {
        "Authorization": `Bearer ${NEBIUS_API_KEY}`,
      },
    }
  );
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to get image url`);

  if (job.status === "completed" && job.result?.image_url) {
    return job.result.image_url;
  } else if (job.status === "failed") {
    throw new Error("Image generation failed");
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        getImageUrl(jobId, apiKey).then(resolve).catch(reject);
      }, 2000);
    });
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
