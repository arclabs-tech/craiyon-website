import * as z from "zod";

export const teamLoginSchema = z.object({
  team_name: z.string().min(3).max(64),
  password: z.string().min(3).max(50),
});
export type TeamLoginSchema = z.infer<typeof teamLoginSchema>;

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

export const imageModels = [
  "sd_xl_base_1.0.safetensors [be9edd61]",
  "v1-5-pruned-emaonly.safetensors [d7049739]",
] as const;

const imageOpts = {
  model: z.enum(imageModels),
  prompt: z.string().min(0).max(2000),
  negative_prompt: z.string().min(0).max(2000),
  steps: z.array(z.number().min(1).max(25)),
  cfg_scale: z.array(z.number().min(1).max(20)),
  seed: z.number().min(-1),
  api_key: z.string().optional(),
  sampler: z.string(),
  width: z.number().min(768).max(1024),
  height: z.number().min(768).max(1024),
};
export const imageOptsSchema = z.object(imageOpts);

export type ImageOpts = z.infer<typeof imageOptsSchema>;

export const imageEntrySchema = z.object({
  team_name: z.string().min(3).max(64),
  image_url: z.string().min(3).max(2000),
  created_at: z.date(),
  score: z.number().min(0).max(1),
  ...imageOpts,
});

export type ImageEntry = {
  image_id: number;
  team_name: string;
  image_url: string;
  created_at: Date;
  score: number;
  model: (typeof imageModels)[number];
  prompt: string;
  negative_prompt: string;
  steps: number;
  cfg_scale: number;
  seed: number;
  sampler: string;
  width: number;
  height: number;
};
