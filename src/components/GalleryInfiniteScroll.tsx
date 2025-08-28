"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import GalleryVoteButton from "@/components/GalleryVoteButton";

const PAGE_SIZE = 12;

export default function GalleryInfiniteScroll({ user, votedIds: initialVotedIds }: { user: any, votedIds: Set<number> }) {
  const [images, setImages] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const votedIds = useRef(new Set(initialVotedIds));
  const loader = useRef<HTMLDivElement | null>(null);

  const fetchImages = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const res = await fetch(`/api/gallery?offset=${offset}&limit=${PAGE_SIZE}`);
    const data = await res.json();
    setImages((prev) => [...prev, ...data]);
    setOffset((prev) => prev + PAGE_SIZE);
    setHasMore(data.length === PAGE_SIZE);
    setLoading(false);
  }, [offset, loading, hasMore]);

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchImages();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [fetchImages, hasMore, loading]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.length === 0 && !loading && <p>No images found.</p>}
      {images.map((img: any) => {
        const voteCount = Number(img.vote_count || 0);
        const initiallyVoted = votedIds.current.has(img.id);
        return (
          <div
            key={img.id}
            className="border rounded-lg overflow-hidden shadow bg-white dark:bg-zinc-900 flex flex-col"
          >
            <div className="relative aspect-square w-full h-64 bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={img.url}
                alt="Generated image"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <div className="text-xs text-zinc-500">By: {img.user}</div>
                {user && (
                  <GalleryVoteButton
                    imageId={img.id}
                    initialVotes={voteCount}
                    initiallyVoted={initiallyVoted}
                  />
                )}
              </div>
              <div className="text-xs text-zinc-400 mt-auto">
                {new Date(img.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={loader} style={{ height: 1 }} />
      {loading && <div className="col-span-full text-center">Loading...</div>}
    </div>
  );
}
