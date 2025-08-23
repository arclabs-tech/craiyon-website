import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    const challenges = await db
      .selectFrom('challenges')
      .select(['id', 'image_url', 'prompt'])
      .orderBy('id', 'asc')
      .execute();

    return NextResponse.json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error('Challenges error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 