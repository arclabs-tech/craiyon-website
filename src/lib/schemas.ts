import * as z from "zod";

export const stylePresets = [
  "none",
  "3d-model",
  "analog-film",
  "anime",
  "cinematic",
  "comic-book",
  "digital-art",
  "enhance",
  "fantasy-art",
  "isometric",
  "line-art",
  "low-poly",
  "neon-punk",
  "origami",
  "photographic",
  "pixel-art",
  "texture",
  "craft-clay",
] as const;

export const imageModels = ["black-forest-labs/flux-schnell"] as const;

const imageOpts = {
  model: z.enum(imageModels),
  prompt: z.string().min(0).max(2000),
  negative_prompt: z.string().min(0).max(2000),
  steps: z.array(z.number().min(1).max(16)),
  guidance_scale: z.array(z.number().min(0).max(100)),
  seed: z.number().min(-1),
  // api_key removed from client schema
  width: z.number().min(64).max(2048),
  height: z.number().min(64).max(2048),
};
export const imageOptsSchema = z.object(imageOpts);

export type ImageOpts = z.infer<typeof imageOptsSchema>;
