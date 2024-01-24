"use server";
import { type TeamLoginSchema } from "@/lib/schemas";
import { hash } from "@/lib/utils";

const teams = new Map<string, string>([
  [hash("team1"), "password1"],
  [hash("team2"), "password2"],
  [hash("team3"), "password3"],
]);

export async function teamLoginAction(data: TeamLoginSchema) {
  const hashed = hash(data.team_name);
  if (!teams.has(hashed)) {
    throw new Error("Team not found");
  }
  if (teams.get(hashed) !== data.password) {
    throw new Error("Invalid password");
  }
  return hashed;
}
