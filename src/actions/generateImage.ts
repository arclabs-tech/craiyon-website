"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";

type ResponseProps = {
  job: string;
  status: string;
};

async function generateImage(opts: ImageOpts) {
  let url: string;
  let width: number;
  let height: number;
  if (opts.model === "sd_xl_base_1.0.safetensors [be9edd61]") {
    url = "https://api.prodia.com/v1/sdxl/generate";
    width = 1024;
    height = 1024;
  } else if (opts.model === "v1-5-pruned-emaonly.safetensors [d7049739]") {
    url = "https://api.prodia.com/v1/sd/generate";
    width = 768;
    height = 768;
  } else {
    throw new Error(`Invalid model: ${opts.model}`);
  }
  const body = {
    ...opts,
    steps: opts.steps[0],
    cfg_scale: opts.cfg_scale[0],
    width: width,
    height: height,
  };
  const apiKey = body.api_key;
  delete body.api_key;

  const { data, status } = await axios.post<ResponseProps>(url, body, {
    headers: {
      "X-Prodia-Key": apiKey,
      "Content-Type": "application/json",
    },
  });
  if (status !== 200)
    throw new Error(`Error ${status}: Failed to generate image`);

  return data;
}

type GetImageUrlResponseProps = {
  job: string;
  status: string;
  imageUrl: string;
};

async function getImageUrl(jobId: string, apiKey: string): Promise<string> {
  const { data: job, status } = await axios.get<GetImageUrlResponseProps>(
    `https://api.prodia.com/v1/job/${jobId}`,
    {
      headers: {
        "X-Prodia-Key": apiKey,
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
