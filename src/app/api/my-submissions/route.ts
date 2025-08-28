import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await db
      .selectFrom("submissions as s")
      .leftJoin("challenges as c", "c.id", "s.challenge_id")
      .select([
        "s.id as id",
        "s.challenge_id as challenge_id",
        "s.generated_image_url as generated_image_url",
        "s.user_prompt as user_prompt",
        "s.score as score",
        "s.created_at as created_at",
        "c.image_url as original_image_url",
        "c.prompt as challenge_prompt",
      ])
      .where("s.user_id", "=", user.id)
      .orderBy("s.created_at", "desc")
      .limit(100)
      .execute();

    return NextResponse.json(
      { success: true, submissions },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("My submissions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
