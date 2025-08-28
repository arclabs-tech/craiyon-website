import { db } from "@/lib/database";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);

  const images = await db
    .selectFrom("generated_images as gi")
    .leftJoin("image_votes as iv", "iv.image_id", "gi.id")
    .select(["gi.id", "gi.user", "gi.prompt", "gi.url", "gi.created_at"])
    .select(({ fn }) => fn.count("iv.id").as("vote_count"))
    .groupBy(["gi.id", "gi.user", "gi.prompt", "gi.url", "gi.created_at"])
    .orderBy("gi.created_at", "desc")
    .limit(limit)
    .offset(offset)
    .execute();

  return NextResponse.json(images);
}
