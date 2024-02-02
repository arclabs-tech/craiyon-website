import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

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
        <main>{children}</main>
        <Toaster position={"top-center"} />
      </body>
    </html>
  );
}
