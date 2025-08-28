import { NextRequest, NextResponse } from "next/server";
import { up } from "../../../../../scripts/migrate-init-schema";

export async function POST(req: NextRequest) {
  try {
    up();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Migration failed" },
      { status: 500 },
    );
  }
}
