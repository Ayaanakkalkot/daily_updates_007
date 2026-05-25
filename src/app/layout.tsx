import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Updates",
  description: "Track your daily work progress",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#0f0f13] text-gray-100 antialiased">
        <NavBar />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
