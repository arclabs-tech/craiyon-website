"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Sparkles, Heart, SkipForward } from "lucide-react";

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

interface ChallengeGridProps {
  onTotalScoreUpdate?: (total: number) => void;
}

export default function ChallengeGrid({
  onTotalScoreUpdate,
}: ChallengeGridProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<SubmissionCount[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [userPrompt, setUserPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [attemptsUsed, setAttemptsUsed] = useState<number>(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(6);
  const [generatedSubmissionId, setGeneratedSubmissionId] = useState<
    number | null
  >(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [votesCount, setVotesCount] = useState<number | null>(null);
  const [voteLoading, setVoteLoading] = useState(false);
  const [skipped, setSkipped] = useState<boolean>(false);

  // Derived helper: whether the user must vote/skip before continuing
  const needsVote = !!generatedImage && !hasVoted && !skipped;

  useEffect(() => {
    fetchChallenges();
    fetchSubmissionCounts();
  }, []);

  const fetchSubmissionCounts = async () => {
    try {
      const response = await fetch("/api/submission-counts");
      const data = await response.json();

      if (data.success) {
        setSubmissionCounts(data.challengeCounts);
      }
    } catch (error) {
      console.error("Error fetching submission counts:", error);
    }
  };

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      const data = await response.json();

      if (data.success) {
        setChallenges(data.challenges);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengeClick = (challenge: Challenge) => {
    // Prevent switching challenges if there's a generated image pending a vote or skip
    if (needsVote) {
      toast.error(
        "Please vote on or skip your generated image before switching challenges"
      );
      return;
    }

    setSelectedChallenge(challenge);
    setUserPrompt("");
    setGeneratedImage(null);
    setScore(null);
    setGeneratedSubmissionId(null);
    setHasVoted(false);
    setVotesCount(null);

    // Get submission count for this challenge
    const count = submissionCounts.find((c) => c.challengeId === challenge.id);
    setAttemptsUsed(count?.attemptsUsed || 0);
    setAttemptsRemaining(count?.attemptsRemaining || 6);
  };

  // When a challenge is opened, fetch latest counts for accuracy
  useEffect(() => {
    const fetchLatestForSelected = async () => {
      if (!selectedChallenge) return;
      try {
        const res = await fetch(
          `/api/submission-counts?challengeId=${selectedChallenge.id}`
        );
        const data = await res.json();
        if (data.success) {
          setAttemptsUsed(data.attemptsUsed ?? 0);
          setAttemptsRemaining(data.attemptsRemaining ?? 6);
          setSubmissionCounts((prev) => {
            const idx = prev.findIndex(
              (c) => c.challengeId === selectedChallenge.id
            );
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
      toast.error("Please enter a prompt");
      return;
    }

    // Check for NSFW content in the prompt
    const nsfwBlacklist = [
      "nude",
      "naked",
      "porn",
      "pornographic",
      "sexual",
      "nsfw",
      "xxx",
      "explicit",
      "adult",
      "sex",
      "erotic",
      "obscene",
      "genitalia",
      "offensive",
      "inappropriate",
      "vulgar",
      "lewd",
      "fuck",
      "pussy",
      "penis",
      "bikini",
      "undies",
      "underwear",
      "undergarments",
      "dick",
      "vagina",
      "pussy",
      "hentai",
      "ecchi",
      "horny",
    ];

    const lowerPrompt = userPrompt.toLowerCase();
    const containsBlacklistedWord = nsfwBlacklist.some(
      (word) =>
        lowerPrompt.includes(word) || lowerPrompt.split(/\s+/).includes(word)
    );

    if (containsBlacklistedWord) {
      toast.error(
        "Your prompt contains inappropriate content. Please try again."
      );
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch("/api/generate-and-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          userPrompt: userPrompt.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedImage(data.submission.generated_image_url);
        setScore(data.submission.score);
        setGeneratedSubmissionId(data.voter_id);
        setHasVoted(false);
        setSkipped(false);
        setVotesCount(null);
        setAttemptsUsed(data.attemptsUsed);
        setAttemptsRemaining(data.attemptsRemaining);
        if (typeof data.totalScore === "number" && onTotalScoreUpdate) {
          onTotalScoreUpdate(data.totalScore);
        }

        // Update local submission counts (create or update entry)
        setSubmissionCounts((prev) => {
          const idx = prev.findIndex(
            (c) => c.challengeId === selectedChallenge.id
          );
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

        toast.success(
          `Generated successfully! Score: ${data.submission.score.toFixed(
            2
          )} (${data.attemptsRemaining} attempts remaining)`
        );
      } else {
        toast.error(data.error || "Failed to generate image");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("An error occurred during generation");
    } finally {
      setGenerating(false);
    }
  };

  const handleVote = async () => {
    if (!generatedSubmissionId) return;
    setVoteLoading(true);
    try {
      const res = await fetch("/api/gallery/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: generatedSubmissionId }),
      });
      const data = await res.json();
      if (res.ok) {
        // If the API returns voted=true then user has upvoted
        if (data.voted) {
          setHasVoted(true);
          setSkipped(false);
          setVotesCount(
            typeof data.votes === "number" ? data.votes : votesCount ?? 0
          );
          toast.success("Thanks for voting — you may continue.");
        } else {
          // toggled off (shouldn't normally happen as initial state) — require upvote
          setHasVoted(false);
          setVotesCount(
            typeof data.votes === "number" ? data.votes : votesCount ?? 0
          );
          toast.error("You must upvote the image to continue");
        }
      } else if (res.status === 401) {
        toast.error("You must be logged in to vote");
      } else {
        toast.error(data.error || "Failed to vote");
      }
    } catch (e) {
      console.error("Vote error", e);
      toast.error("Vote failed");
    } finally {
      setVoteLoading(false);
    }
  };

  const handleSkip = () => {
    if (!generatedSubmissionId) return;
    // Mark as skipped locally so the user can continue. This doesn't record a DB-level "skip".
    setSkipped(true);
    // Clear the generated submission id so the UI no longer blocks navigation/generation
    setGeneratedSubmissionId(null);
    // Keep the generated image visible but allow continuing
    toast("Skipped voting — you may continue.");
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
                <Image
                  src={challenge.image_url}
                  alt={`Challenge ${challenge.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200 text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Click to Generate</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-slate-200">
                  Challenge {challenge.id}
                </h3>
                {(() => {
                  const count = submissionCounts.find(
                    (c) => c.challengeId === challenge.id
                  );
                  const used = count?.attemptsUsed || 0;
                  const remaining = count?.attemptsRemaining || 6;
                  return (
                    <div className="text-xs">
                      <span
                        className={`font-medium ${
                          remaining > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
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

      <Dialog
        open={!!selectedChallenge}
        onOpenChange={(open) => {
          // Prevent closing the dialog if there's a generated image that hasn't been voted on or skipped
          if (!open && needsVote) {
            toast.error(
              "Please vote on or skip your generated image before closing"
            );
            return;
          }
          if (!open) {
            setSelectedChallenge(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Challenge {selectedChallenge?.id}</DialogTitle>
            <DialogDescription>{selectedChallenge?.prompt}</DialogDescription>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span
                className={`font-medium ${
                  attemptsRemaining > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
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
              <Label className="text-sm font-medium mb-2 block">
                Original Image
              </Label>
              <div className="aspect-square relative overflow-hidden rounded-lg border">
                {selectedChallenge && (
                  <Image
                    src={selectedChallenge.image_url}
                    alt="Original"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>

            {/* Generated Image */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Your Generated Image
              </Label>
              <div className="aspect-square relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {generating ? (
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Generating...</p>
                  </div>
                ) : generatedImage ? (
                  <Image
                    src={generatedImage}
                    alt="Generated"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Your image will appear here</p>
                  </div>
                )}
              </div>

              {/* Voting area: require a vote before continuing */}
              {generatedImage && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Votes:{" "}
                    <span className="font-semibold">{votesCount ?? 0}</span>
                    {hasVoted && (
                      <span className="ml-2 text-emerald-600">(you voted)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleVote}
                      disabled={
                        !generatedSubmissionId || voteLoading || hasVoted
                      }
                      variant={hasVoted ? "ghost" : "default"}
                      aria-pressed={hasVoted}
                      aria-label={hasVoted ? "Voted" : "Vote"}
                      className="p-2"
                    >
                      {voteLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Heart
                          className={`w-4 h-4 ${
                            hasVoted ? "text-rose-600 fill-current" : ""
                          }`}
                        />
                      )}
                      <span className="sr-only">
                        {hasVoted ? "Voted" : "Vote"}
                      </span>
                    </Button>
                    <Button
                      onClick={handleSkip}
                      variant="ghost"
                      disabled={!generatedImage}
                      aria-label={skipped ? "Skipped" : "Skip"}
                      className="p-2"
                    >
                      <SkipForward
                        className={`w-4 h-4 ${skipped ? "opacity-60" : ""}`}
                      />
                      <span className="sr-only">
                        {skipped ? "Skipped" : "Skip"}
                      </span>
                    </Button>
                  </div>
                </div>
              )}

              {score !== null && (
                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-center">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Score: {score.toFixed(2)}
                    </span>
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

            <Button
              onClick={handleGenerate}
              disabled={
                generating ||
                !userPrompt.trim() ||
                attemptsRemaining <= 0 ||
                (generatedSubmissionId !== null && !hasVoted && !skipped)
              }
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
            {needsVote && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Please vote on or skip your generated image before generating
                another or closing.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
