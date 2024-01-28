import { cookies } from "next/headers";
import { getLeaderboard } from "@/actions/leaderboard";
import LeaderBoard from "./leaderboard";
import { getTeamName } from "@/lib/login";

export default async function LeaderBoardPage() {
  const cookieStore = cookies();
  const team_name_cookie = cookieStore.get("team_name");
  if (!team_name_cookie) {
    return <div>Not logged in</div>;
  }
  const team_name = getTeamName(team_name_cookie.value);
  const entries = await getLeaderboard();
  return (
    <div className="flex flex-col p-8 gap-4 items-center">
      <h1 className="text-4xl font-semibold">Leaderboard</h1>
      <div className="w-full lg:w-1/2">
        <LeaderBoard team_name={team_name} entries={entries} />
      </div>
    </div>
  );
}
