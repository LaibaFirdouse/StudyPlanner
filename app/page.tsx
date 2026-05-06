"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("beginner");
  const [days, setDays] = useState(7);
  const { data: session } = useSession();

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

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Example: I want to learn Angular"
              rows={5}
              className="w-full bg-zinc-900/60 placeholder-zinc-500 text-white rounded-xl p-4 mb-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none h-32"
            />

            <div className="flex gap-3 mb-4">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="flex-1 bg-zinc-900/60 text-white rounded-lg p-3 border border-white/6 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option className="bg-zinc-900 text-white" value="beginner">Beginner</option>
                <option className="bg-zinc-900 text-white" value="intermediate">Intermediate</option>
                <option className="bg-zinc-900 text-white" value="advanced">Advanced</option>
              </select>

              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-28 bg-zinc-900/60 text-white rounded-lg p-3 border border-white/6 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option className="bg-zinc-900 text-white" value={7}>7d</option>
                <option className="bg-zinc-900 text-white" value={14}>14d</option>
                <option className="bg-zinc-900 text-white" value={30}>30d</option>
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

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-zinc-400">Tip: try short, specific prompts for best results.</div>

          <div>
            {session ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-white/6 hover:bg-white/8 text-white rounded-lg px-4 py-2 text-sm transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-2 bg-white text-zinc-900 rounded-lg px-4 py-2 text-sm font-medium hover:brightness-95 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="w-4 h-4" aria-hidden>
                  <path fill="#4285f4" d="M533.5 278.4c0-18.5-1.6-36.3-4.7-53.7H272v101.6h147.1c-6.3 34-25 62.8-53.2 82l86 66.7c50.2-46.4 79.6-114.6 79.6-196.6z" />
                  <path fill="#34a853" d="M272 544.3c72.6 0 133.6-24 178-65.4l-86-66.7c-24 16.1-54.9 25.6-92 25.6-70.8 0-130.8-47.8-152.2-112.1l-89.8 69.4C74.9 485 166.6 544.3 272 544.3z" />
                  <path fill="#fbbc04" d="M119.8 327.7c-10.4-30.7-10.4-63.9 0-94.6L30 163.7C-15.7 241.1-15.7 317.2 30 394.6l89.8-66.9z" />
                  <path fill="#ea4335" d="M272 109.1c39.4 0 74.9 13.6 102.8 40.3l77.1-77.1C405.6 24.6 344.6 0 272 0 166.6 0 74.9 59.3 30 148.3l89.8 69.4C141.2 156.9 201.2 109.1 272 109.1z" />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}