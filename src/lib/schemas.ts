import * as z from "zod";

export const teamLoginSchema = z.object({
  team_name: z.string().min(3).max(50),
  password: z.string().min(8).max(50),
});
export type TeamLoginSchema = z.infer<typeof teamLoginSchema>;

export const stylePresets = [
  "",
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

export const imageOptsSchema = z.object({
  model: z.string(),
  prompt: z.string().min(0).max(2000),
  negative_prompt: z.string().min(0).max(2000),
  style_preset: z.enum(stylePresets),
  steps: z.number().min(1).max(25),
  cfg_scale: z.number().min(1).max(20),
  seed: z.literal(1),
  sampler: z.string(),
  width: z.literal(1024),
  height: z.literal(1024),
});

export type ImageOpts = z.infer<typeof imageOptsSchema>;

export const imageEntrySchema = z.object({
  team_name: z.string().min(3).max(50),
  image_url: z.string().min(3).max(2000),
  opts: imageOptsSchema,
  created_at: z.date(),
});

export type ImageEntry = z.infer<typeof imageEntrySchema>;
