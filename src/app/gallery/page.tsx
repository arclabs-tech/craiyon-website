'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Submission {
  id: number;
  challenge_id: number;
  generated_image_url: string;
  user_prompt: string;
  score: number;
  created_at: string;
  original_image_url: string | null;
  challenge_prompt: string | null;
}

export default function GalleryPage() {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/my-submissions', { cache: 'no-store' });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.success) setSubs(data.submissions);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-slate-600 dark:text-slate-400">Loading your gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            My Gallery
          </h1>
          <Button variant="outline" onClick={() => router.push('/')}>Back to Challenges</Button>
        </div>

        {subs.length === 0 ? (
          <div className="text-center py-12 text-slate-600 dark:text-slate-400">
            You haven’t generated any images yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.map((s) => (
              <Card key={s.id} className="overflow-hidden bg-white/95 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
                <CardContent className="p-0">
                  <div className="aspect-square">
                    <img src={s.generated_image_url} alt={`Submission ${s.id}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge>Score: {s.score.toFixed(2)}</Badge>
                      <span className="text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Your prompt</div>
                      <div className="text-sm">{s.user_prompt}</div>
                    </div>
                    {s.challenge_prompt && (
                      <div className="border-t pt-2">
                        <div className="text-xs text-slate-500">Challenge prompt</div>
                        <div className="text-sm">{s.challenge_prompt}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
