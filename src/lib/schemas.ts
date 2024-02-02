import * as z from "zod";

export const teamLoginSchema = z.object({
  team_name: z.string().min(3).max(64),
  password: z.string().min(8).max(50),
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
  "dreamshaperXL10_alpha2.safetensors [c8afe2ef]",
  "dynavisionXL_0411.safetensors [c39cc051]",
  "juggernautXL_v45.safetensors [e75f5471]",
  "realismEngineSDXL_v10.safetensors [af771c3f]",
] as const;

const imageOpts = {
  model: z.enum(imageModels),
  prompt: z.string().min(0).max(2000),
  negative_prompt: z.string().min(0).max(2000),
  steps: z.array(z.number().min(1).max(25)),
  cfg_scale: z.array(z.number().min(1).max(20)),
  seed: z.number().min(2).max(1000000),
  style_preset: z.enum(stylePresets).optional(),
  sampler: z.string(),
  width: z.literal(1024),
  height: z.literal(1024),
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
  style_preset?: (typeof stylePresets)[number];
  sampler: string;
  width: 1024;
  height: 1024;
};

const textModels = ["gpt-3.5-turbo-1106", "llama-2-13b"] as const;
const textOpts = {
  model: z.enum(textModels),
  user_prompt: z.string().min(0).max(1200),
  system_prompt: z.string().min(0).max(1200),
  temperature: z.array(z.number().min(0).max(1)),
  max_tokens: z.number().min(1).max(2048),
};

export const textOptsSchema = z.object(textOpts);
export type TextOpts = z.infer<typeof textOptsSchema>;

export const textEntrySchema = z.object({
  team_name: z.string().min(3).max(64),
  generation: z.string().min(1).max(8000),
  created_at: z.date(),
  score: z.number().min(0).max(1),
  ...textOpts,
});

export type TextEntry = {
  text_id: number;
  team_name: string;
  generation: string;
  created_at: Date;
  score: number;
  model: (typeof textModels)[number];
  user_prompt: string;
  system_prompt: string;
  temperature: number;
  max_tokens: number;
};
