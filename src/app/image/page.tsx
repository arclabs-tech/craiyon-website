/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Index() {
  return (
    <div className="flex flex-col gap-4 px-6 items-center">
      <h1 className="text-6xl font-semibold text-center">Choose an image</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Img id="1" />
      </div>
    </div>
  );
}

function Img({ id }: { id: string }) {
  return (
    <Link className="w-72 h-72" href={`/image/${id}`}>
      <img
        className="rounded-xl border-4"
        src={`/images/${id}.png`}
        alt={`Image ${id}`}
      />
    </Link>
  );
}
