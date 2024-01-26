"use server";

import { db } from "@/lib/db";
import { ImageEntry } from "@/lib/schemas";

export async function addImageEntry(imageEntry: ImageEntry) {
  const { insertId } = await db
    .insertInto("image_entries")
    .values(imageEntry)
    .executeTakeFirst();
  return insertId;
}

export async function getAllEntries(): Promise<ImageEntry[]> {
  const entries = await db
    .selectFrom("image_entries")
    .selectAll()
    .orderBy("score", "desc")
    .execute();
  return entries;
}

export async function getEntriesByTeamName(
  teamName: string
): Promise<ImageEntry[]> {
  const entries = await db
    .selectFrom("image_entries")
    .selectAll()
    .where("team_name", "=", teamName)
    .orderBy("created_at", "desc")
    .execute();
  return entries;
}

export async function getEntriesByImageId(
  imageId: number
): Promise<ImageEntry[]> {
  const entries = await db
    .selectFrom("image_entries")
    .selectAll()
    .where("image_id", "=", imageId)
    .orderBy("score", "desc")
    .execute();
  return entries;
}
