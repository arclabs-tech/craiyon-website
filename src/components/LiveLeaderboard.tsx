"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardEntry {
  id: number | string;
  username: string;
  total_score: number;
}

const REFRESH_INTERVAL_MS = 5000; // 5s polling interval

export default function LiveLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const res = await fetch("/api/leaderboard", {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (data?.leaderboard) {
        setLeaderboard((prev) => {
          // Only update state if something actually changed to avoid unnecessary re-renders
          const changed =
            prev.length !== data.leaderboard.length ||
            prev.some((p: LeaderboardEntry, i: number) => {
              const n = data.leaderboard[i];
              return !n || n.id !== p.id || n.total_score !== p.total_score;
            });
          return changed ? data.leaderboard : prev;
        });
      }
    } catch (e: any) {
      if (e?.name === "AbortError") return; // ignore aborted fetch
      setError(e.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Visibility-aware polling: pause when tab hidden
    const handleVisibility = () => {
      if (document.hidden) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      } else {
        // Trigger immediate refresh when returning
        fetchLeaderboard();
        if (!timerRef.current) {
          timerRef.current = setInterval(fetchLeaderboard, REFRESH_INTERVAL_MS);
        }
      }
    };

    fetchLeaderboard(); // initial
    timerRef.current = setInterval(fetchLeaderboard, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (timerRef.current) clearInterval(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return <Badge className="bg-yellow-500 text-white">🥇 1st</Badge>;
    if (rank === 2)
      return <Badge className="bg-gray-400 text-white">🥈 2nd</Badge>;
    if (rank === 3)
      return <Badge className="bg-amber-600 text-white">🥉 3rd</Badge>;
    return <Badge variant="secondary">#{rank}</Badge>;
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Leaderboard
          </span>
          <Trophy className="w-8 h-8 text-yellow-500" />
        </CardTitle>
        <CardDescription className="text-center text-lg text-slate-600 dark:text-slate-400">
          Top performers in the image generation challenge
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div
            className="mb-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}
        <div className="space-y-3" aria-live="polite" aria-busy={loading}>
          {loading && leaderboard.length === 0 && (
            <div
              className="space-y-2 animate-pulse"
              data-testid="leaderboard-loading"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-slate-200/60 dark:bg-slate-700/50"
                />
              ))}
            </div>
          )}
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md ${
                index < 3
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-800 shadow-lg"
                  : "bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(index + 1)}
                  {getRankBadge(index + 1)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                    {entry.username}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Score: {entry.total_score.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {entry.total_score.toFixed(2)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  points
                </div>
              </div>
            </div>
          ))}
          {!loading && leaderboard.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">
                No submissions yet. Be the first to participate!
              </p>
            </div>
          )}
        </div>
        <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500">
          Auto-updating every {Math.round(REFRESH_INTERVAL_MS / 1000)}s
        </p>
      </CardContent>
    </Card>
  );
}
