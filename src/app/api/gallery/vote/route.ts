import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { getCurrentUser } from "@/lib/auth";

// POST toggles an upvote on an image. Body: { imageId: number }
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { imageId } = await req.json();
    if (!imageId || typeof imageId !== "number") {
      return NextResponse.json({ error: "Invalid imageId" }, { status: 400 });
    }

    // Check if vote exists
    const existing = await db
      .selectFrom("image_votes")
      .select(["id"])
      .where("image_id", "=", imageId)
      .where("user_id", "=", user.id)
      .executeTakeFirst();

    if (existing) {
      // Remove vote (toggle off)
      await db
        .deleteFrom("image_votes")
        .where("id", "=", existing.id)
        .execute();
      // Return new count
      const count = await db
        .selectFrom("image_votes")
        .select(({ fn }) => fn.countAll<number>().as("c"))
        .where("image_id", "=", imageId)
        .executeTakeFirst();
      return NextResponse.json({ voted: false, votes: Number(count?.c ?? 0) });
    } else {
      await db
        .insertInto("image_votes")
        .values({ image_id: imageId, user_id: user.id })
        .execute();
      const count = await db
        .selectFrom("image_votes")
        .select(({ fn }) => fn.countAll<number>().as("c"))
        .where("image_id", "=", imageId)
        .executeTakeFirst();
      return NextResponse.json({ voted: true, votes: Number(count?.c ?? 0) });
    }
  } catch (err) {
    console.error("Vote error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET returns vote count and whether current user voted. Query: ?imageId=123
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageIdStr = searchParams.get("imageId");
    if (!imageIdStr) {
      return NextResponse.json({ error: "Missing imageId" }, { status: 400 });
    }
    const imageId = Number(imageIdStr);
    if (Number.isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid imageId" }, { status: 400 });
    }
    const user = await getCurrentUser();
    const count = await db
      .selectFrom("image_votes")
      .select(({ fn }) => fn.countAll<number>().as("c"))
      .where("image_id", "=", imageId)
      .executeTakeFirst();
    let voted = false;
    if (user) {
      const existing = await db
        .selectFrom("image_votes")
        .select("id")
        .where("image_id", "=", imageId)
        .where("user_id", "=", user.id)
        .executeTakeFirst();
      voted = !!existing;
    }
    return NextResponse.json({ votes: Number(count?.c ?? 0), voted });
  } catch (err) {
    console.error("Vote GET error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
