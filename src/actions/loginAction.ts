"use server";
import * as z from "zod";
import { type TeamLoginSchema } from "@/lib/schemas";

const teams = new Map<string, string>([
  ["team1", "password1"],
  ["team2", "password2"],
  ["team3", "password3"],
]);

export async function teamLoginAction(data: TeamLoginSchema) {
  console.log("teamLoginAction", data);
  if (!teams.has(data.team_name)) {
    throw new Error("Team not found");
  }
  if (teams.get(data.team_name) !== data.password) {
    throw new Error("Invalid password");
  }
  return true;
}
