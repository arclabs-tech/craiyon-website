/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Index() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Link href="/image/1">
        <img src="/images/1.png" alt="Image 1" />
      </Link>
    </div>
  );
}
