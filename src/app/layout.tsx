import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col w-full h-full pt-4`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Toaster position={"top-center"} />
        </ThemeProvider>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex flex-row justify-between items-center px-12">
      <Image src={"/craiyon-logo.svg"} alt="Craiyon" width={250} height={120} />
      <div className="flex flex-row gap-4 items-center">
        <Image src={"/logo_light.png"} alt="Arclabs" width={120} height={120} />
        <Image src={"/aura-logo.svg"} alt="Aura" width={120} height={120} />
        <Image src={"/aiml-logo.svg"} alt="AIML" width={120} height={120} />
      </div>
    </header>
  );
}
