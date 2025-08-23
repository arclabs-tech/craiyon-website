import { db } from '@/lib/database';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getImages() {
  // Fetch all images from the generated_images table, newest first
  return db.selectFrom('generated_images')
    .selectAll()
    .orderBy('created_at', 'desc')
    .execute();
}

export default async function GalleryPage() {
  const images = await getImages();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.length === 0 && <p>No images found.</p>}
        {images.map(img => (
          <div key={img.id} className="border rounded-lg overflow-hidden shadow bg-white dark:bg-zinc-900">
            <div className="relative aspect-square w-full h-64 bg-zinc-100 dark:bg-zinc-800">
              <Image src={img.url} alt={img.prompt} fill className="object-contain" />
            </div>
            <div className="p-4">
              <div className="text-xs text-zinc-500 mb-1">By: {img.user}</div>
              <div className="font-medium text-sm mb-1">{img.prompt}</div>
              <div className="text-xs text-zinc-400">{new Date(img.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
