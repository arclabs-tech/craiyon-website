'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
  id: number;
  username: string;
  total_score: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-white">🥇 1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white">🥈 2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 text-white">🥉 3rd</Badge>;
    return <Badge variant="secondary">#{rank}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </Button>
        </div>

        <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Leaderboard</span>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </CardTitle>
            <CardDescription className="text-center text-lg text-slate-600 dark:text-slate-400">
              Top performers in the image generation challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                    index < 3 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-800 shadow-lg' 
                      : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(index + 1)}
                      {getRankBadge(index + 1)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{entry.username}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Total Score: {entry.total_score.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {entry.total_score.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">points</div>
                  </div>
                </div>
              ))}
            </div>
            
            {leaderboard.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400">
                  No submissions yet. Be the first to participate!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 