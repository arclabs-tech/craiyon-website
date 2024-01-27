"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export const columns: ColumnDef<LeaderboardEntry>[] = [
  {
    accessorKey: "team_name",
    header: "Team Name",
  },
  {
    accessorKey: "total_score",
    header: "Score",
  },
];
