"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export function getColumns(team_name: string) {
  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "team_name",
      header: "Team Name",
      cell: ({ row }) => {
        const entry = row.original;
        if (entry.team_name == team_name) {
          return <b>{entry.team_name}</b>;
        } else {
          return entry.team_name;
        }
      },
    },
    {
      accessorKey: "total_score",
      header: "Score",
      cell: ({ row }) => {
        const entry = row.original;
        if (entry.team_name == team_name) {
          return <b>{entry.total_score}</b>;
        } else {
          return entry.total_score;
        }
      },
    },
  ];

  return columns;
}
