import { db } from "@/lib/database";

import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import GalleryInfiniteScroll from "@/components/GalleryInfiniteScroll";

export const dynamic = "force-dynamic";

// Image fetching is now handled client-side with infinite scroll

// Client vote button moved to separate component

export default async function GalleryPage() {
  const user = await getCurrentUser();
  let votedIds: Set<number> = new Set();
  if (user) {
    const votes = await db
      .selectFrom("image_votes")
      .select(["image_id"])
      .where("user_id", "=", user.id)
      .execute();
    votedIds = new Set(votes.map((v) => v.image_id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      {user && <Header user={user} />}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Gallery</h1>
        <GalleryInfiniteScroll user={user} votedIds={votedIds} />
      </main>
    </div>
  );
}
