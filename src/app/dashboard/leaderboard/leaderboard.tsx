"use client";

import { LeaderboardEntry, getColumns } from "./columns";
import { DataTable } from "./data-table";

export default function LeaderBoard({
  team_name,
  entries,
}: {
  team_name: string;
  entries: LeaderboardEntry[];
}) {
  "use client";
  const columns = getColumns(team_name);
  return <DataTable columns={columns} data={entries} />;
}
