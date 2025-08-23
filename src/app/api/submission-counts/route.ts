import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    if (challengeId) {
      // Get count for specific challenge
      const count = await db
        .selectFrom('submission_counts')
        .select(['attempts_used'])
        .where('user_id', '=', user.id)
        .where('challenge_id', '=', parseInt(challengeId))
        .executeTakeFirst();

      const attemptsUsed = count?.attempts_used || 0;
      const attemptsRemaining = Math.max(0, 6 - attemptsUsed);

      return NextResponse.json({
        success: true,
        attemptsUsed,
        attemptsRemaining,
        canSubmit: attemptsRemaining > 0
      });
    } else {
      // Get counts for all challenges
      const counts = await db
        .selectFrom('submission_counts')
        .select(['challenge_id', 'attempts_used'])
        .where('user_id', '=', user.id)
        .execute();

      const challengeCounts = counts.map(count => ({
        challengeId: count.challenge_id,
        attemptsUsed: count.attempts_used,
        attemptsRemaining: Math.max(0, 6 - count.attempts_used),
        canSubmit: Math.max(0, 6 - count.attempts_used) > 0
      }));

      return NextResponse.json({
        success: true,
        challengeCounts
      });
    }
  } catch (error) {
    console.error('Get submission counts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 