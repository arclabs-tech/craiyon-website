"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";
import { getSrcEmbeddings } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/similarity";

type ResponseProps = {
  job: string;
  status: string;
};

async function generateImage(opts: ImageOpts) {
  const body = {
    ...opts,
    steps: opts.steps[0],
    cfg_scale: opts.cfg_scale[0],
  };
  if (body.style_preset == "none") delete body.style_preset;

  const { data, status } = await axios.post<ResponseProps>(
    "https://api.prodia.com/v1/sdxl/generate",
    body,
    {
      headers: {
        "X-Prodia-Key": process.env.PRODIA_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to generate image`);

  return data;
}

type GetImageUrlResponseProps = {
  job: string;
  status: string;
  imageUrl: string;
};

async function getImageUrl(jobId: string): Promise<string> {
  const { data: job, status } = await axios.get<GetImageUrlResponseProps>(
    `https://api.prodia.com/v1/job/${jobId}`,
    {
      headers: {
        "X-Prodia-Key": process.env.PRODIA_API_KEY,
      },
    }
  );
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to get image url`);

  if (job.status === "succeeded") {
    return job.imageUrl;
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        getImageUrl(jobId).then(resolve).catch(reject);
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
