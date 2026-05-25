"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type EntryData = {
  date: string;
  points: string[];
};

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<EntryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const TODAY = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/updates")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load history");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f13] px-4 py-14">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest text-indigo-400 uppercase mb-2">Timeline</p>
            <h1 className="text-3xl font-semibold text-white">History</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add today
          </Link>
        </div>

        {loading && (
          <div className="flex gap-2 items-center justify-center py-20 text-gray-600">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-75" />
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-150" />
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm">No history yet.</p>
            <Link href="/" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">
              Log today&apos;s work
            </Link>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {entries.length > 0 && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.05] ml-[7px]" />
          )}
          <div className="space-y-6">
            {entries.map((entry, idx) => (
              <div key={entry.date} className="flex gap-5">
                {/* Dot */}
                <div className="relative shrink-0 mt-1">
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 ${
                      idx === 0 ? "bg-indigo-500 border-indigo-500" : "bg-[#0f0f13] border-gray-700"
                    }`}
                  />
                </div>

                {/* Card */}
                <div className="flex-1 bg-[#16161d] border border-white/[0.06] rounded-2xl overflow-hidden mb-1">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">{formatDate(entry.date)}</span>
                    <div className="flex items-center gap-2">
                      {entry.date === TODAY && (
                        <span className="text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                      <span className="text-xs text-gray-600">
                        {entry.points.length} {entry.points.length === 1 ? "point" : "points"}
                      </span>
                    </div>
                  </div>

                  {entry.points.length > 0 && (
                    <>
                      <div className="h-px bg-white/[0.04] mx-5" />
                      <ul className="px-5 py-4 space-y-2">
                        {entry.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                            <span className="mt-2 w-1 h-1 rounded-full bg-indigo-500/60 shrink-0" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {entry.points.length === 0 && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-gray-700 italic">Nothing logged</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
