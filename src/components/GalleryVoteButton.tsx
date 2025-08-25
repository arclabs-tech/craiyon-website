"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export function GalleryVoteButton({ imageId, initialVotes, initiallyVoted }: { imageId: number; initialVotes: number; initiallyVoted: boolean }) {
  const [votes, setVotes] = React.useState(initialVotes);
  const [voted, setVoted] = React.useState(initiallyVoted);
  const [loading, setLoading] = React.useState(false);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gallery/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setVoted(data.voted);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={toggle} size="sm" variant={voted ? 'default' : 'secondary'} disabled={loading} className="gap-1" aria-pressed={voted} aria-label={voted ? 'Remove vote' : 'Add vote'}>
      <Heart className={`w-4 h-4 ${voted ? 'fill-current' : ''}`} />
      <span>{votes}</span>
    </Button>
  );
}

export default GalleryVoteButton;