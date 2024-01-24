export type ImageOpts = {
  model_name: string;
  prompt: string;
  negative_prompt: string;
  style_preset: string;
  steps: number;
  cfg_scale: number;
  seed: number;
  sampler: string;
  width: number;
  height: number;
};

export type ImageEntry = {
  team_name: string;
  image_url: string;
  opts: ImageOpts;
  created_at: Date;
};
