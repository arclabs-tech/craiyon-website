import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ChallengeGrid from '@/components/ChallengeGrid';
import Header from '@/components/Header';

export default async function HomePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Image Generation Challenge
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Welcome, <span className="font-semibold text-slate-800 dark:text-slate-200">{user.username}</span>! Click on any image below to start generating.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
            Your total score: <span className="font-bold text-blue-600 dark:text-blue-400">{user.total_score.toFixed(2)}</span>
          </p>
        </div>
        
        <ChallengeGrid />
      </main>
    </div>
  );
}
