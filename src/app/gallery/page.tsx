import { db } from '@/lib/database';
import Image from 'next/image';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/auth';
import GalleryVoteButton from '@/components/GalleryVoteButton';

export const dynamic = 'force-dynamic';

async function getImages() {
  // Fetch images with vote counts
  return db.selectFrom('generated_images as gi')
    .leftJoin('image_votes as iv', 'iv.image_id', 'gi.id')
    .select(['gi.id', 'gi.user', 'gi.prompt', 'gi.url', 'gi.created_at'])
    .select(({ fn }) => fn.count('iv.id').as('vote_count'))
  .groupBy(['gi.id', 'gi.user', 'gi.prompt', 'gi.url', 'gi.created_at'])
    .orderBy('gi.created_at', 'desc')
    .execute();
}

// Client vote button moved to separate component

export default async function GalleryPage() {
  const user = await getCurrentUser();
  const images = await getImages();

  // Determine which images current user voted for (query in one round trip if user logged in)
  let votedIds = new Set<number>();
  if (user) {
    const votes = await db.selectFrom('image_votes')
      .select(['image_id'])
      .where('user_id', '=', user.id)
      .execute();
    votedIds = new Set(votes.map(v => v.image_id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {user && <Header user={user} />}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.length === 0 && <p>No images found.</p>}
          {images.map((img: any) => {
            const voteCount = Number(img.vote_count || 0);
            const initiallyVoted = votedIds.has(img.id);
            return (
              <div key={img.id} className="border rounded-lg overflow-hidden shadow bg-white dark:bg-zinc-900 flex flex-col">
                <div className="relative aspect-square w-full h-64 bg-zinc-100 dark:bg-zinc-800">
                  <Image src={img.url} alt="Generated image" fill className="object-contain" />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-500">By: {img.user}</div>
                    {user && (
                      <GalleryVoteButton imageId={img.id} initialVotes={voteCount} initiallyVoted={initiallyVoted} />
                    )}
                  </div>
                  <div className="text-xs text-zinc-400 mt-auto">{new Date(img.created_at).toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
