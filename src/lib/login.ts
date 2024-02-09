import { pbkdf2Sync } from "crypto";

const salt = "fvjreshvdujknedik";
export function hash(team_name: string) {
  return pbkdf2Sync(team_name, salt, 1000, 64, "sha512").toString("hex");
}
const teams = [
  ["Arun Amar Kurali", "PES1UG21CS111"],
  ["Amit Prakash", "PES1UG23AM042"],
  ["Bhaveen Madhavan", "PES1UG22CS141"],
  ["HEMANTH S BANUR", "PES1UG22CS237"],
  ["Lalithadithya N", "PES1UG23AM159"],
  ["Lekhyasree Medarametla", "PES1UG23CS328"],
  ["Manas G Mutalikdesai", "PES1UG22CS327"],
  ["Meera Reji", "PES1UG22CS342"],
  ["Myla Kinnera Sri", "PES1UG22EC904"],
  ["Piyush Goel", "PES1UG22AM114"],
  ["Sanjay Seshadri", "PES1UG22CS531"],
  ["Shreevathsa Gorur Prashanth", "PES1UG22CS568"],
  ["Sridhar", "PES1202202367"],
  ["Aditya H R", "Aditya H R"],
  ["Bhuvan S", "Bhuvan S"],
  ["CVP", "CVP"],
  ["Abhishek Bhat", "Abhishek Bhat"],
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
