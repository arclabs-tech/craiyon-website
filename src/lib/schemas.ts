import * as z from "zod";

export const teamLoginSchema = z.object({
  team_name: z.string().min(3).max(50),
  password: z.string().min(8).max(50),
});
export type TeamLoginSchema = z.infer<typeof teamLoginSchema>;
