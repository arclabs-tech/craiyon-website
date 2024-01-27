"use server";
import { type TeamLoginSchema } from "@/lib/schemas";
import { hash } from "@/lib/login";
import { hashedTeams } from "@/lib/login";

export async function teamLoginAction(data: TeamLoginSchema) {
  const hashed = hash(data.team_name);
  if (!hashedTeams.has(hashed)) {
    throw new Error("Team not found");
  }
  if (hashedTeams.get(hashed)!.password !== data.password) {
    throw new Error("Invalid password");
  }
  return hashed;
}
