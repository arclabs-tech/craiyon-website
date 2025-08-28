import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import dynamic from "next/dynamic";

// Dynamically load client component without SSR to avoid hydration mismatch while polling
const LiveLeaderboard = dynamic(() => import("@/components/LiveLeaderboard"), {
  ssr: false,
});

export default async function LeaderboardPage() {
  const user = await getCurrentUser();
  return (
    <>
      {user && <Header user={user} />}
      <div className="max-w-4xl mx-auto">
        <LiveLeaderboard />
      </div>
    </>
  );
}
