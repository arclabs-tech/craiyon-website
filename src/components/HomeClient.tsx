"use client";

import { useState } from 'react';
import ChallengeGrid from '@/components/ChallengeGrid';
import Header from '@/components/Header';
import type { User } from '@/lib/auth';

interface HomeClientProps {
  user: User;
}

export default function HomeClient({ user }: HomeClientProps) {
  const [totalScore, setTotalScore] = useState<number>(user.total_score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <Header user={{ ...user, total_score: totalScore }} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Image Generation Challenge
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user.username}</span>! Click on any image below to start generating.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Your total score: <span className="font-bold text-blue-600 dark:text-blue-400">{totalScore.toFixed(2)}</span>
          </p>
        </div>
        <ChallengeGrid onTotalScoreUpdate={setTotalScore} />
      </main>
    </div>
  );
}
