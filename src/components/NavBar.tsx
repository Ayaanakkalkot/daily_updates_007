"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.05] bg-[#0f0f13]/80 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-white tracking-tight hover:text-indigo-400 transition-colors">
          Daily Updates
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/" className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]">
            Today
          </Link>
          <Link href="/history" className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]">
            History
          </Link>
          <button
            onClick={handleSignOut}
            className="text-xs text-gray-600 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
