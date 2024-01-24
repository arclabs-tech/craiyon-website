"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";

type ResponseProps = {
  job: string;
  status: string;
};

export async function generateImage(data: ImageOpts) {
  const body = {
    ...data,
    steps: data.steps[0],
    cfg_scale: data.cfg_scale[0],
  };
  if (body.style_preset == "none") delete body.style_preset;

  const opts = {
    headers: {
      "Content-Type": "application/json",
      "X-Prodia-Key": process.env.PRODIA_API_KEY,
    },
  };

  const res = await axios.post<ResponseProps>(
    "https://api.prodia.com/v1/sdxl/generate",
    body,
    opts
  );
  // const jobId = res.data.job;
  return res.data;
}

type GetImageUrlResponseProps = {
  job: string;
  status: string;
  imageUrl: string;
};

export async function getJobInfo(jobId: string) {
  const opts = {
    headers: {
      "X-Prodia-Key": process.env.PRODIA_API_KEY,
    },
  };

  const res = await axios.get<GetImageUrlResponseProps>(
    `https://api.prodia.com/v1/job/${jobId}`,
    opts
  );
  // const imageUrl = res.data.imageUrl;
  return res.data;
}

export async function getImageUrl(jobId: string): Promise<string> {
  const job = await getJobInfo(jobId);

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
