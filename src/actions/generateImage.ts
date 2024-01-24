"use server";

import axios from "axios";

import { type ImageOpts } from "@/lib/schemas";

type ResponseProps = {
  job: string;
  status: string;
};

export async function getJobId(data: ImageOpts) {
  const res = await axios.post<ResponseProps>(
    "https://api.prodia.com/v1/sdxl/generate",
    {
      ...data,
      steps: data.steps[0],
      cfg_scale: data.cfg_scale[0],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Prodia-Key": "6569ec58-a289-4f93-a577-5997fe15acc4",
      },
    }
  );
  const jobId = res.data.job;
  return jobId;
}
