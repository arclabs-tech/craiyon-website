import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";
import { sql } from "kysely";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "No SQL query provided." },
        { status: 400 }
      );
    }
    // WARNING: This endpoint is extremely dangerous. Restrict access in production!
    // Use Kysely's sql tag to run raw SQL
    const result = await sql`${sql.raw(query)}`.execute(db);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "SQL error" },
      { status: 500 }
    );
  }
}
