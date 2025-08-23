import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const leaderboard = await db
      .selectFrom('users')
      .select(['id', 'username', 'total_score'])
      .orderBy('total_score', 'desc')
      .limit(50)
      .execute();

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 