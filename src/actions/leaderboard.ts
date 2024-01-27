"use server";

import { db } from "@/lib/db";
import { sql } from "kysely";
import { getTeamName } from "@/lib/login";

type LeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export async function getLeaderboard() {
  const data = await sql<LeaderboardEntry>`
  SELECT team_name, SUM(score) AS total_score
  FROM (
      SELECT team_name, MAX(score) AS score
      FROM image_entries
      GROUP BY team_name, image_id
  ) AS max_scores
  GROUP BY team_name
  ORDER BY total_score DESC;
  `.execute(db);

  const rows = data.rows.map((row) => ({
    team_name: getTeamName(row.team_name),
    total_score: row.total_score,
  }));

  return rows;
}
