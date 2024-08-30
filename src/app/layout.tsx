import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Craiyon",
  description: "AI Art Generation Contest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col w-full h-full pt-4`}>
        <Header />
        <main>{children}</main>
        <Toaster position={"top-center"} />
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex flex-row justify-between items-center px-12">
      <Image src={"/craiyon-logo.svg"} alt="Craiyon" width={250} height={120} />
      <div className="flex flex-row gap-4">
        <Image src={"/aura-logo.svg"} alt="Craiyon" width={120} height={120} />
        <Image src={"/aiml-logo.svg"} alt="Craiyon" width={120} height={120} />
      </div>
    </header>
  );
}
