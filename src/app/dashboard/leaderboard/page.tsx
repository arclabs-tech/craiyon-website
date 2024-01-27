import { getLeaderboard } from "@/actions/leaderboard";

export default async function LeaderBoard() {
  const entries = await getLeaderboard();
  console.log(entries);
  return <h1>LeaderBoard</h1>;
}
