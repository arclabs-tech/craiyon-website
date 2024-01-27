"use server";

import { db } from "@/lib/db";
import { TextEntry } from "@/lib/schemas";

export async function addTextEntry(textEntry: TextEntry) {
  const { insertId } = await db
    .insertInto("text_entries")
    .values(textEntry)
    .executeTakeFirst();
  return insertId;
}

export async function getAllEntries(): Promise<TextEntry[]> {
  const entries = await db
    .selectFrom("text_entries")
    .selectAll()
    .orderBy("score", "desc")
    .execute();
  return entries;
}

export async function getEntriesByTeamName(
  teamName: string
): Promise<TextEntry[]> {
  const entries = await db
    .selectFrom("text_entries")
    .selectAll()
    .where("team_name", "=", teamName)
    .orderBy("created_at", "desc")
    .execute();
  return entries;
}

export async function getEntriesByTextId(textId: number): Promise<TextEntry[]> {
  const entries = await db
    .selectFrom("text_entries")
    .selectAll()
    .where("text_id", "=", textId)
    .orderBy("score", "desc")
    .execute();
  return entries;
}

export async function getNumOfEntriesByTextId(
  textId: number,
  team_name: string
): Promise<number> {
  const length = await db
    .selectFrom("text_entries")
    .select(({ fn, val, ref }) => fn.countAll().as("count"))
    .where("text_id", "=", textId)
    .where("team_name", "=", team_name)
    .execute();
  return length[0].count as number;
}
