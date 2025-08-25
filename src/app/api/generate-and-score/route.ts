import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/database';
import { generateImage } from '@/actions/generateImage';
import { compareImages } from '@/lib/image-comparison';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
  const body = await request.json().catch(() => null);
  const challengeIdRaw = body?.challengeId;
  const userPrompt: string | undefined = body?.userPrompt;
    const challengeId = typeof challengeIdRaw === 'string' || typeof challengeIdRaw === 'number'
      ? Number(challengeIdRaw)
      : NaN;

    if (!Number.isFinite(challengeId) || !userPrompt || !userPrompt.trim()) {
      return NextResponse.json(
        { error: 'Challenge ID (number) and non-empty prompt are required' },
        { status: 400 }
      );
    }

    // Get the challenge details
    const challenge = await db
      .selectFrom('challenges')
      .select(['id', 'image_url', 'prompt'])
      .where('id', '=', challengeId)
      .executeTakeFirst();

  if (!challenge || !challenge.prompt || !challenge.image_url) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }

    // Check submission count for this challenge
    const submissionCount = await db
      .selectFrom('submission_counts')
      .select(['attempts_used'])
      .where('user_id', '=', user.id)
      .where('challenge_id', '=', challengeId)
      .executeTakeFirst();

    const attemptsUsed = submissionCount?.attempts_used || 0;
    const attemptsRemaining = 6 - attemptsUsed;

    if (attemptsRemaining <= 0) {
      return NextResponse.json(
        { error: 'You have used all 6 attempts for this challenge' },
        { status: 400 }
      );
    }

  const cleanedPrompt = userPrompt.trim();
  // Generate image using the existing generateImage function
  const generatedImageUrl = await generateImage({ opts: cleanedPrompt, user: user.username });

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      );
    }

  // Calculate score using image embeddings only (cosine similarity)
  const imageScore = await compareImages(challenge.image_url, generatedImageUrl);
  console.log(`🎯 Image-only scoring: image=${imageScore}`);

  const finalScore = imageScore;
  console.log(`📊 Final score (image-only): ${finalScore}`);

    // Get user's CURRENT best score for this challenge BEFORE saving new submission
    const previousBest = await db
      .selectFrom('submissions')
      .select((eb) => eb.fn.max('score').as('max_score'))
      .where('user_id', '=', user.id)
      .where('challenge_id', '=', challengeId)
      .executeTakeFirst();

    const currentBest = Number(previousBest?.max_score) || 0;
    console.log(`📈 Previous best for challenge ${challengeId}: ${currentBest.toFixed(2)}, New score: ${finalScore.toFixed(2)}`);

    // Save submission to database
    const submission = await db
      .insertInto('submissions')
      .values({
        user_id: user.id,
        challenge_id: challengeId,
        generated_image_url: generatedImageUrl,
        user_prompt: cleanedPrompt,
        score: finalScore,
      })
      .returning(['id', 'score'])
      .executeTakeFirst();

    // Update or create submission count
    try {
      await db
        .insertInto('submission_counts')
        .values({
          user_id: user.id,
          challenge_id: challengeId,
          attempts_used: 1,
        })
        .execute();
    } catch (error) {
      // If insert fails due to unique constraint, update instead
      await db
        .updateTable('submission_counts')
        .set((eb) => ({
          attempts_used: eb('attempts_used', '+', 1),
          updated_at: eb.val('datetime(\'now\')'),
        }))
        .where('user_id', '=', user.id)
        .where('challenge_id', '=', challengeId)
        .execute();
    }

    // Update user's total score using max score per challenge approach
    // Only update total if this is a new personal best for this challenge
    if (finalScore > currentBest) {
      const scoreImprovement = finalScore - currentBest;
      await db
        .updateTable('users')
        .set((eb) => ({
          total_score: eb('total_score', '+', scoreImprovement)
        }))
        .where('id', '=', user.id)
        .execute();
      
      console.log(`🏆 New personal best! Improved by ${scoreImprovement.toFixed(2)} (${currentBest.toFixed(2)} → ${finalScore.toFixed(2)})`);
    } else {
      console.log(`📊 Score ${finalScore.toFixed(2)} not better than personal best ${currentBest.toFixed(2)} for this challenge`);
    }

    const newAttemptsUsed = attemptsUsed + 1;
    const newAttemptsRemaining = 6 - newAttemptsUsed;

    // Fetch updated total score (may have changed if new personal best)
    const updatedUser = await db
      .selectFrom('users')
      .select(['total_score'])
      .where('id', '=', user.id)
      .executeTakeFirst();

    return NextResponse.json({
      success: true,
      submission: {
        id: submission?.id,
        score: submission?.score,
        generated_image_url: generatedImageUrl,
      },
      attemptsUsed: newAttemptsUsed,
      attemptsRemaining: newAttemptsRemaining,
      canSubmit: newAttemptsRemaining > 0,
      totalScore: updatedUser?.total_score ?? user.total_score,
    });
  } catch (error) {
    console.error('Generate and score error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 