import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <HomeClient user={user} />;
}
