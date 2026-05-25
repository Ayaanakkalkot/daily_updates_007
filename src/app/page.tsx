"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useUser } from "@/hooks/useUser";

const TODAY = new Date().toISOString().split("T")[0];

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodayPage() {
  const [points, setPoints] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const user = useUser();

  useEffect(() => {
    fetch(`/api/updates/${TODAY}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.points) setPoints(data.points);
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, []);

  const addPoint = () => {
    const val = input.trim();
    if (!val) return;
    const next = [...points, val];
    setPoints(next);
    setInput("");
    autosave(next);
    inputRef.current?.focus();
  };

  const removePoint = (i: number) => {
    const next = points.filter((_, idx) => idx !== i);
    setPoints(next);
    autosave(next);
  };

  const autosave = async (pts: string[]) => {
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(`/api/updates/${TODAY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pts }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Save failed");
      }
      setStatus("saved");
    } catch (e: unknown) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addPoint();
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex items-start justify-center px-4 py-14">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase mb-2">Daily Log</p>
          <h1 className="text-3xl font-semibold text-white leading-tight">
            {user ? `Welcome back, ${user.displayName}` : formatDate(TODAY)}
          </h1>
          {user && (
            <p className="text-gray-500 text-sm mt-1">{formatDate(TODAY)}</p>
          )}
        </div>

        {/* Card */}
        <div className="bg-[#16161d] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">

          {/* Points list */}
          <div className="px-6 pt-6 pb-4 min-h-[180px]">
            {status === "loading" ? (
              <div className="flex gap-2 items-center text-gray-600 text-sm py-8 justify-center">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-75" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150" />
              </div>
            ) : points.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">No points yet. Add what you did today.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {points.map((pt, i) => (
                  <li key={i} className="group flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span className="flex-1 text-[0.9rem] text-gray-200 leading-relaxed">{pt}</span>
                    <button
                      onClick={() => removePoint(i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-400 mt-0.5"
                      aria-label="Remove"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] mx-6" />

          {/* Input row */}
          <div className="px-6 py-4 flex items-center gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="What did you work on today?"
              autoFocus
              className="flex-1 bg-transparent text-gray-100 text-sm placeholder-gray-600 outline-none"
            />
            <button
              onClick={addPoint}
              disabled={!input.trim()}
              className="shrink-0 w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Status bar */}
          <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-xs text-gray-600">
              {points.length} {points.length === 1 ? "point" : "points"} logged
            </span>
            <span className="text-xs">
              {status === "saving" && <span className="text-indigo-400">Saving…</span>}
              {status === "saved" && <span className="text-emerald-400">Saved</span>}
              {status === "error" && <span className="text-red-400">{error}</span>}
            </span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-gray-700 mt-6">
          Press <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-gray-500 font-mono">Enter</kbd> to add a point
        </p>
      </div>
    </div>
  );
}
