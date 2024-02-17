import { pbkdf2Sync } from "crypto";

const salt = "fvjreshvdujknedik";
export function hash(team_name: string) {
  return pbkdf2Sync(team_name, salt, 1000, 64, "sha512").toString("hex");
}
const teams = [
  ["workshop", "workshop"],
  ["team1", "team1"],
];

export const hashedTeams = new Map<
  string,
  { team_name: string; password: string }
>(
  teams.map(([team_name, password]) => [
    hash(team_name),
    {
      team_name,
      password,
    },
  ])
);
export function getTeamName(hashed: string) {
  const team = hashedTeams.get(hashed);
  if (team) {
    return team.team_name;
  } else {
    return "";
  }
}
