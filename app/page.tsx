"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(7);

  const router = useRouter();

  const handleGenerate = async () => {
    if (!goal) return;

    setLoading(true);

    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        level: "beginner",
        days: 7,
      }),
    });

    const data = await res.json();

    router.push(`/plan/${data.planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-gradient-to-b from-black/40 to-white/2 backdrop-blur-sm border border-white/5 rounded-3xl p-10 shadow-2xl">

        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Create your study plan
          </h1>
          <p className="mt-3 text-zinc-300 max-w-2xl mx-auto">
            Plan your success. Generate a customized roadmap for any skill you want to learn.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <section className="md:col-span-2 bg-white/3 rounded-2xl p-6 border border-white/6">
            <label className="block text-sm text-zinc-300 mb-2">Your Prompt</label>

            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Example: I want to learn Angular"
              className="w-full min-h-[120px] h-32 resize-none bg-zinc-900/60 placeholder-zinc-500 text-white rounded-xl p-4 mb-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <div className="flex gap-3 mb-4">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="flex-1 bg-white/5 text-white rounded-lg p-3 border border-white/6"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-28 bg-white/5 text-white rounded-lg p-3 border border-white/6"
              >
                <option value={7}>7d</option>
                <option value={14}>14d</option>
                <option value={30}>30d</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={async () => {
                  if (!goal) return alert("Enter a goal");

                  const res = await fetch("/api/generate-plan", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      goal,
                      level,
                      days,
                    }),
                  });

                  const data = await res.json();

                  window.location.href = `/plan/${data.planId}`;
                }}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-zinc-900 font-semibold px-6 py-3 rounded-xl shadow hover:brightness-105 transition"
              >
                Generate Plan
              </button>

              <Link href="/dashboard" className="text-sm text-zinc-300 hover:underline">
                View Dashboard
              </Link>
            </div>
          </section>

          <aside className="md:col-span-1 bg-white/3 rounded-2xl p-6 border border-white/6 h-full">
            <h3 className="text-lg font-semibold mb-2">Recently Shared</h3>
            <p className="text-zinc-400 text-sm mb-4">Discover recently shared learning paths from our community.</p>

            <div className="space-y-3">
              <div className="p-3 bg-white/4 rounded-lg border border-white/6">
                <div className="text-sm font-medium">Learn React — 14 days</div>
                <div className="text-xs text-zinc-400">Shared by community</div>
              </div>
              <div className="p-3 bg-white/4 rounded-lg border border-white/6">
                <div className="text-sm font-medium">Python for Data — 30 days</div>
                <div className="text-xs text-zinc-400">Shared by community</div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}