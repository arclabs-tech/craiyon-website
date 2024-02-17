import { pbkdf2Sync } from "crypto";

const salt = "fvjreshvdujknedik";
export function hash(team_name: string) {
  return pbkdf2Sync(team_name, salt, 1000, 64, "sha512").toString("hex");
}
const teams = [
  ["Creative cogs", "5t7g8k68m3"],
  ["Duo-Mode", "66ou1f8hvz"],
  ["But thunders ", "8zyl3698bu"],
  ["Starks", "638da8d2a0"],
  ["Nova", "qp4285m8z9"],
  ["Melon Musk", "o6av9k173h"],
  ["Access Denied", "6r01cva12n"],
  ["Neo", "qanap40xs9"],
  ["Mancity X Liverpool", "3s3o7t59mb"],
  ["Error makers ", "bzn3g8qo45"],
  ["1500", "obbuusf7xk"],
  ["Cyber knights ", "ti9u5w6h20"],
  ["Gen-N", "rp6498p97l"],
  ["Team Royale", "k8449u4266"],
  ["Wicked Bits", "8by3g93w22"],
  ["ARTANZA ", "503fn6m3h9"],
  ["Canvas Alchemists", "q5r81u437n"],
  ["Image Innovators", "447b2caf24"],
  ["PINK ART", "22ysq2xo53"],
  ["Paragons", "wv486jk29k"],
  ["CanvasJoy", "8bv6lj50cu"],
  ["PixelPioneers", "a75284mk1y"],
  ["Pixel Picassos", "c2e07fswzv"],
  ["RuntimeError", "ta59tf34n0"],
  ["Team JK", "nl80sha55v"],
  ["Coders ", "9946q0dxfh"],
  ["CTRL freaks ", "lzwhj6vjkr"],
  ["Mu-Llama", "93x25263nc"],
  ["CrAIola", "64hr63h716"],
  ["Watermelon juice ", "u28ehs1z8f"],
  ["Black and white", "fm01337he7"],
  ["Creative Mavericks ", "064h81o10p"],
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
