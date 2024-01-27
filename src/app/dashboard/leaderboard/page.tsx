import { getLeaderboard } from "@/actions/leaderboard";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import dynamic from "next/dynamic";

async function LeaderBoard() {
  const entries = await getLeaderboard();
  return (
    <div className="flex flex-col p-8 gap-4 items-center">
      <h1 className="text-4xl font-semibold">Leaderboard</h1>
      <div className="w-full lg:w-1/2">
        <DataTable columns={columns} data={entries} />
      </div>
    </div>
  );
}

// Disable SSR
const LeaderBoardPage = dynamic(() => Promise.resolve(LeaderBoard), {
  ssr: false,
});

export default LeaderBoardPage;
