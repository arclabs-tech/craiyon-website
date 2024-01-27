import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}

function Header() {
  return (
    <header className="flex flex-row justify-between items-center p-4">
      <div className="flex flex-row gap-4 items-center">
        <h1 className="text-4xl font-semibold">Craiyon</h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Link href="/dashboard">
          <Button variant={"outline"} className="w-full">
            Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/submissions">
          <Button variant={"outline"} className="w-full">
            Your Submissions
          </Button>
        </Link>
        <Link href="/dashboard/leaderboard">
          <Button variant={"outline"} className="w-full">
            Leaderboard
          </Button>
        </Link>
      </div>
    </header>
  );
}
