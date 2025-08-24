'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Sparkles } from 'lucide-react';

interface Challenge {
  id: number;
  image_url: string;
  prompt: string;
}

interface SubmissionCount {
  challengeId: number;
  attemptsUsed: number;
  attemptsRemaining: number;
  canSubmit: boolean;
}

export default function ChallengeGrid() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<SubmissionCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(6);

  useEffect(() => {
    fetchChallenges();
    fetchSubmissionCounts();
  }, []);

  const fetchSubmissionCounts = async () => {
    try {
      const response = await fetch('/api/submission-counts');
      const data = await response.json();
      
      if (data.success) {
        setSubmissionCounts(data.challengeCounts);
      }
    } catch (error) {
      console.error('Error fetching submission counts:', error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      
      if (data.success) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setUserPrompt('');
  setNegativePrompt('');
    setGeneratedImage(null);
    setScore(null);
    
    // Get submission count for this challenge
    const count = submissionCounts.find(c => c.challengeId === challenge.id);
    setAttemptsUsed(count?.attemptsUsed || 0);
    setAttemptsRemaining(count?.attemptsRemaining || 6);
  };

  // When a challenge is opened, fetch latest counts for accuracy
  useEffect(() => {
    const fetchLatestForSelected = async () => {
      if (!selectedChallenge) return;
      try {
        const res = await fetch(`/api/submission-counts?challengeId=${selectedChallenge.id}`);
        const data = await res.json();
        if (data.success) {
          setAttemptsUsed(data.attemptsUsed ?? 0);
          setAttemptsRemaining(data.attemptsRemaining ?? 6);
          setSubmissionCounts(prev => {
            const idx = prev.findIndex(c => c.challengeId === selectedChallenge.id);
            if (idx === -1) {
              return [
                ...prev,
                {
                  challengeId: selectedChallenge.id,
                  attemptsUsed: data.attemptsUsed ?? 0,
                  attemptsRemaining: data.attemptsRemaining ?? 6,
                  canSubmit: (data.attemptsRemaining ?? 6) > 0,
                },
              ];
            }
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              attemptsUsed: data.attemptsUsed ?? 0,
              attemptsRemaining: data.attemptsRemaining ?? 6,
              canSubmit: (data.attemptsRemaining ?? 6) > 0,
            };
            return next;
          });
        }
      } catch (e) {
        // non-blocking
      }
    };
    fetchLatestForSelected();
  }, [selectedChallenge]);

  const handleGenerate = async () => {
    if (!selectedChallenge || !userPrompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/generate-and-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          userPrompt: userPrompt.trim(),
          negativePrompt: negativePrompt.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedImage(data.submission.generated_image_url);
        setScore(data.submission.score);
        setAttemptsUsed(data.attemptsUsed);
        setAttemptsRemaining(data.attemptsRemaining);
        
        // Update local submission counts (create or update entry)
        setSubmissionCounts(prev => {
          const idx = prev.findIndex(c => c.challengeId === selectedChallenge.id);
          if (idx === -1) {
            return [
              ...prev,
              {
                challengeId: selectedChallenge.id,
                attemptsUsed: data.attemptsUsed,
                attemptsRemaining: data.attemptsRemaining,
                canSubmit: data.attemptsRemaining > 0,
              },
            ];
          }
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            attemptsUsed: data.attemptsUsed,
            attemptsRemaining: data.attemptsRemaining,
            canSubmit: data.attemptsRemaining > 0,
          };
          return next;
        });
        
        toast.success(`Generated successfully! Score: ${data.submission.score.toFixed(2)} (${data.attemptsRemaining} attempts remaining)`);
      } else {
        toast.error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('An error occurred during generation');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-lg"
            onClick={() => handleChallengeClick(challenge)}
          >
            <CardContent className="p-4">
              <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                <img
                  src={challenge.image_url}
                  alt={`Challenge ${challenge.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Click to Generate</p>
                  </div>
                </div>
              </div>
                                        <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">Challenge {challenge.id}</h3>
                {(() => {
                  const count = submissionCounts.find(c => c.challengeId === challenge.id);
                  const used = count?.attemptsUsed || 0;
                  const remaining = count?.attemptsRemaining || 6;
                  return (
                    <div className="text-xs">
                      <span className={`font-medium ${remaining > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {remaining} attempts remaining
                      </span>
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Challenge {selectedChallenge?.id}</DialogTitle>
            <DialogDescription>
              {selectedChallenge?.prompt}
            </DialogDescription>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className={`font-medium ${attemptsRemaining > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {attemptsRemaining} attempts remaining
              </span>
              {attemptsUsed > 0 && (
                <span className="text-slate-500 dark:text-slate-400 ml-2">
                  ({attemptsUsed} used)
                </span>
              )}
            </div>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Original Image</Label>
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                <img
                  src={selectedChallenge?.image_url}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Generated Image */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Your Generated Image</Label>
              <div className="aspect-square relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {generating ? (
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Generating...</p>
                  </div>
                ) : generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Your image will appear here</p>
                  </div>
                )}
              </div>
              
                             {score !== null && (
                 <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                   <p className="text-center">
                     <span className="font-semibold text-blue-600 dark:text-blue-400">Score: {score.toFixed(2)}</span>
                   </p>
                 </div>
               )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt" className="text-sm font-medium">
                Your Prompt
              </Label>
              <Input
                id="prompt"
                placeholder="Describe the image you want to generate..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={generating}
              />
            </div>
            <div>
              <Label htmlFor="negativePrompt" className="text-sm font-medium">
                Negative Prompt (optional)
              </Label>
              <Input
                id="negativePrompt"
                placeholder="What you don't want in the image..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                disabled={generating}
              />
            </div>
            
            <Button
              onClick={handleGenerate}
              disabled={generating || !userPrompt.trim() || attemptsRemaining <= 0}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : attemptsRemaining <= 0 ? (
                <>
                  <span className="text-red-500">No attempts remaining</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Image ({attemptsRemaining} left)
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 