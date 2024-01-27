/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashBoard() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center pt-10">
      <Link href="/dashboard/image">
        <Button className="w-56 p-8 text-2xl">Image Round</Button>
      </Link>
      <Link href="/dashboard/text">
        <Button className="w-56 p-8 text-2xl">Text Round</Button>
      </Link>
      <Link
        href="/dashboard/leaderboard"
        className="flex flex-col items-center"
      >
        <Button className="w-56 p-8 text-2xl">Leaderboard</Button>
      </Link>
    </div>
  );
}
