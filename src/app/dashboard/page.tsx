/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function DashBoard() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center pt-10">
      <Link href="/image" className="flex flex-col items-center">
        <img src="/image.png" alt="Image" className="w-72 h-72 rounded-xl" />
        <h1 className="text-4xl font-semibold">Image Round</h1>
      </Link>
      <Link href="/text" className="flex flex-col items-center">
        <img src="/text.png" alt="Text" className="w-72 h-72 rounded-xl" />
        <h1 className="text-4xl font-semibold">Text Round</h1>
      </Link>
    </div>
  );
}
