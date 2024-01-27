import { pbkdf2Sync } from "crypto";

const salt = "fvjreshvdujknedik";
export function hash(team_name: string) {
  return pbkdf2Sync(team_name, salt, 1000, 64, "sha512").toString("hex");
}
const teams = [
  ["team1", "password1"],
  ["team2", "password2"],
  ["team3", "password3"],
];

export const hashedTeams = new Map<
  string,
  { team_name: string; password: string }
>();
for (const [team_name, password] of teams) {
  hashedTeams.set(hash(team_name), {
    team_name,
    password,
  });
}

export function getTeamName(hashed: string) {
  return hashedTeams.get(hashed)!.team_name;
}
