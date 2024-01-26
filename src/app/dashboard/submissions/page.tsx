import { cookies } from "next/headers";
import { getEntriesByTeamName } from "@/actions/imageEntries";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Submissions() {
  const cookieStore = cookies();
  const team_name_cookie = cookieStore.get("team_name");
  if (!team_name_cookie) {
    return <div>Not logged in</div>;
  }
  const team_name = team_name_cookie.value;

  const entries = await getEntriesByTeamName(team_name);
  return (
    <div className="flex flex-col p-8 gap-4 items-center">
      <h1 className="text-4xl font-semibold">Your Submissions</h1>
      <div className="rounded-2xl border-2 w-full lg:w-1/2">
        <DataTable columns={columns} data={entries} />
      </div>
    </div>
  );
}
