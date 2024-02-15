import { cookies } from "next/headers";
import { getEntriesByTeamName as getImageEntriesByTeamName } from "@/actions/imageEntries";
import { DataTable } from "./data-table";
import { columns as imageColumns } from "./columns";

export default async function Submissions() {
  const cookieStore = cookies();
  const team_name_cookie = cookieStore.get("team_name");
  if (!team_name_cookie) {
    return <div>Not logged in</div>;
  }
  const team_name = team_name_cookie.value;

  const imageEntries = await getImageEntriesByTeamName(team_name);
  return (
    <div className="flex flex-col p-8 gap-4 items-center">
      <h1 className="text-4xl font-semibold">Your Submissions</h1>
      <div className="w-full lg:w-1/2">
        <DataTable columns={imageColumns} data={imageEntries} />
      </div>
    </div>
  );
}
