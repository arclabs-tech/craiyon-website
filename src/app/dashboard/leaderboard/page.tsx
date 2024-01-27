import { getLeaderboard } from "@/actions/leaderboard";
import { LeaderboardEntry, columns } from "./columns";
import { DataTable } from "./data-table";

export default async function LeaderBoard({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  return (
    <div className="flex flex-col p-8 gap-4 items-center">
      <h1 className="text-4xl font-semibold">Leaderboard</h1>
      <div className="w-full lg:w-1/2">
        <DataTable columns={columns} data={entries} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const entries = await getLeaderboard();
  return {
    props: {
      entries,
    },
  };
}
