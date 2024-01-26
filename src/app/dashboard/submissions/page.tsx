import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cookies } from "next/headers";
import { getEntriesByTeamName } from "@/actions/imageEntries";
import { ImageEntry } from "@/lib/schemas";

export default async function Submissions() {
  const cookieStore = cookies();
  const team_name_cookie = cookieStore.get("team_name");
  if (!team_name_cookie) {
    return <div>Not logged in</div>;
  }
  const team_name = team_name_cookie.value;

  const entries = await getEntriesByTeamName(team_name);
  return (
    <div className="flex flex-col p-8 gap-4">
      <h1 className="text-4xl font-semibold">Your Submissions</h1>
      <div className="rounded-2xl border-2">
        <SubmissionsTable entries={entries} />
      </div>
    </div>
  );
}

function SubmissionsTable({ entries }: { entries: ImageEntry[] }) {
  return (
    <Table className="rounded-2xl border-none">
      <TableCaption>Your submitted images</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image No.</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="w-10">Model Name</TableHead>
          <TableHead className="w-48">prompt</TableHead>
          <TableHead>negative_prompt</TableHead>
          <TableHead>steps</TableHead>
          <TableHead>cfg_scale</TableHead>
          <TableHead>seed</TableHead>
          <TableHead>style_preset?</TableHead>
          <TableHead>sampler</TableHead>
          <TableHead>width</TableHead>
          <TableHead>height</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => (
          <TableEntry key={entry.image_id} entry={entry} />
        ))}
      </TableBody>
    </Table>
  );
}

function TableEntry({ entry }: { entry: ImageEntry }) {
  return (
    <TableRow className="text-ellipsis">
      <TableCell>{entry.image_id}</TableCell>
      <TableCell>{entry.score}</TableCell>
      <TableCell>
        <a href={entry.image_url} className="text-blue-600 underline">
          {entry.image_url}
        </a>
      </TableCell>
      <TableCell>{entry.created_at.toString()}</TableCell>
      <TableCell className="text-ellipsis overflow-hidden w-10">
        {entry.model}
      </TableCell>
      <TableCell className="w-48">{entry.prompt}</TableCell>
      <TableCell>{entry.negative_prompt}</TableCell>
      <TableCell>{entry.steps}</TableCell>
      <TableCell>{entry.cfg_scale}</TableCell>
      <TableCell>{entry.seed}</TableCell>
      <TableCell>{entry.style_preset}</TableCell>
      <TableCell>{entry.sampler}</TableCell>
      <TableCell>{entry.width}</TableCell>
      <TableCell>{entry.height}</TableCell>
    </TableRow>
  );
}
