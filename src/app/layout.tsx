import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily Updates",
  description: "Track your daily work progress",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="bg-[#0f0f13] text-gray-100 antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0f0f13]/80 backdrop-blur-md px-6 py-3.5">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-white tracking-tight hover:text-indigo-400 transition-colors">
              Daily Updates
            </Link>
            <div className="flex gap-1">
              <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]">
                Today
              </Link>
              <Link href="/history" className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]">
                History
              </Link>
            </div>
          </div>
        </nav>
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
