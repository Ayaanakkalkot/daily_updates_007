"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase mb-3">Daily Updates</p>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-gray-600 text-sm mt-2">Sign in to access your daily log</p>
        </div>

        <div className="bg-[#16161d] border border-white/[0.06] rounded-2xl p-8 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={onKey}
              autoFocus
              autoComplete="username"
              className="w-full bg-[#0f0f13] border border-white/[0.08] rounded-xl px-4 py-3 text-gray-100 text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKey}
              autoComplete="current-password"
              className="w-full bg-[#0f0f13] border border-white/[0.08] rounded-xl px-4 py-3 text-gray-100 text-sm placeholder-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
