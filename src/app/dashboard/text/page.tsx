import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Index() {
  return (
    <div className="flex flex-col gap-4 px-6 items-center">
      <h1 className="text-6xl font-semibold text-center">Choose a text</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Text id="1" />
      </div>
    </div>
  );
}

function Text({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/text/${id}`}>
      <Button variant={"outline"}>Text {id}</Button>
    </Link>
  );
}
