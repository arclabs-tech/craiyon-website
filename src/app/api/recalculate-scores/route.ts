import { NextResponse } from "next/server";
import { db } from "@/lib/database";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    console.log(
      "🔄 Recalculating all user scores based on max per challenge...",
    );

    // Get all users
    const users = await db
      .selectFrom("users")
      .select(["id", "username"])
      .execute();

    for (const user of users) {
      // Get user's best score for each challenge they've attempted
      const bestScores = await db
        .selectFrom("submissions")
        .select(["challenge_id"])
        .select((eb) => eb.fn.max("score").as("max_score"))
        .where("user_id", "=", user.id)
        .groupBy("challenge_id")
        .execute();

      // Sum up all their best scores
      const totalScore = bestScores.reduce(
        (sum, record) => sum + (Number(record.max_score) || 0),
        0,
      );

      // Update user's total score
      await db
        .updateTable("users")
        .set({ total_score: Math.round(totalScore * 100) / 100 })
        .where("id", "=", user.id)
        .execute();

      console.log(
        `✅ ${user.username}: recalculated to ${totalScore.toFixed(2)} (from ${bestScores.length} challenges)`,
      );
    }

    console.log("🎉 Score recalculation complete!");

    return NextResponse.json({
      success: true,
      message: "All user scores recalculated based on max per challenge",
      usersUpdated: users.length,
    });
  } catch (error) {
    console.error("Score recalculation error:", error);
    return NextResponse.json(
      { error: "Failed to recalculate scores" },
      { status: 500 },
    );
  }
}
