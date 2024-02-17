/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Index() {
  return (
    <div className="flex flex-col gap-4 px-6 items-center">
      <h1 className="text-6xl font-semibold text-center">Choose an image</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((id) => (
          <Img key={id} id={id.toString()} />
        ))}
        <Link
          className="w-72 h-72 flex flex-col justify-center items-center border-4 rounded-xl"
          href={`/dashboard/image/open`}
        >
          <p className="text-2xl font-semibold text-center">
            Open <br />
            Section
          </p>
        </Link>
      </div>
    </div>
  );
}

function Img({ id }: { id: string }) {
  return (
    <Link className="w-72 h-72" href={`/dashboard/image/${id}`}>
      <img
        className="rounded-xl border-4"
        src={`/images/${id}.png`}
        alt={`Image ${id}`}
      />
    </Link>
  );
}
