"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch("/api/plans", {
                    cache: "no-store",
                });

                if (!res.ok) throw new Error("Failed");

                const data = await res.json();
                setPlans(data.plans || []);
            } catch (err) {
                console.error("ERROR:", err);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);


    // 🔥 FORMAT TITLE
    const formatTitle = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    // 🔥 REAL ANALYTICS (FRONTEND BASED)
    const totalPlans = plans.length;

    const avgProgress =
        plans.length === 0
            ? 0
            : Math.round(
                plans.reduce((acc, p) => acc + (p.progress || 0), 0) / plans.length
            );

    const completedPlans = plans.filter((p) => p.progress === 100).length;

    // 🔹 LOADING
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-zinc-400">
                Loading plans...
            </div>
        );
    }

    // 🔹 EMPTY STATE
    if (plans.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center bg-black text-white px-4">
                <h2 className="text-2xl font-semibold mb-2">No plans yet</h2>

                <p className="text-zinc-400 mb-4">
                    Create your first study plan to get started
                </p>

                <button
                    onClick={() => router.push("/")}
                    className="bg-white text-black px-5 py-2 rounded-lg"
                >
                    Create Plan
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#04040a] via-[#0b0b0f] to-[#04040a] py-12 px-6">
            <div className="max-w-6xl mx-auto">

                <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/6 shadow-2xl ring-1 ring-violet-700/10">

                    {/* 🔥 HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">Your Study Plans</h1>
                            <p className="text-zinc-400 mt-2 max-w-lg">Track progress and stay consistent — focus on one step at a time.</p>
                        </div>

                        <div className="ml-auto">
                            <button
                                onClick={() => router.push("/")}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:opacity-95 transition"
                            >
                                + New Plan
                            </button>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-3 bg-white/4 backdrop-blur-md border border-white/8 rounded-full px-4 py-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 text-white shadow-md">
                                🔥
                            </span>
                            <div className="text-sm text-zinc-100">
                                <div className="leading-none">Current streak</div>
                                <div className="text-white font-semibold">3 days</div>
                            </div>
                        </div>

                        <div className="ml-auto text-sm text-zinc-400">Keep the momentum — complete at least one task today.</div>
                    </div>

                    {/* 🔥 REAL ANALYTICS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

                        <div className="p-8 min-h-[120px] rounded-2xl bg-white/6 bg-clip-padding backdrop-blur-lg border border-white/10 shadow-2xl flex flex-col justify-center">
                            <p className="text-sm text-zinc-200">Total Plans</p>
                            <h3 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">{totalPlans}</h3>
                        </div>

                        <div className="p-8 min-h-[120px] rounded-2xl bg-white/6 bg-clip-padding backdrop-blur-lg border border-white/10 shadow-2xl flex flex-col justify-center">
                            <p className="text-sm text-zinc-200">Avg Progress</p>
                            <h3 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">{avgProgress}%</h3>
                        </div>

                        <div className="p-8 min-h-[120px] rounded-2xl bg-white/6 bg-clip-padding backdrop-blur-lg border border-white/10 shadow-2xl flex flex-col justify-center">
                            <p className="text-sm text-zinc-200">Completed</p>
                            <h3 className="text-3xl md:text-4xl font-extrabold mt-2 text-white">{completedPlans}</h3>
                        </div>

                    </div>

                    {/* 🔥 PLAN GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan: any) => {
                            const progress = plan.progress ?? 0;

                            return (
                                <div
                                    key={plan._id}
                                    onClick={() => router.push(`/plan/${plan._id}`)}
                                    className="p-8 rounded-2xl bg-white/4 bg-clip-padding backdrop-blur-md border border-white/8 hover:scale-[1.02] transition-transform cursor-pointer shadow-2xl"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-lg font-semibold capitalize text-white">
                                                {formatTitle(plan.goal)}
                                            </h2>

                                            <p className="text-sm text-zinc-400 mt-1">
                                                {plan.duration} days • {plan.level}
                                            </p>
                                        </div>

                                        <span className="text-sm text-zinc-300 font-medium">
                                            {progress}%
                                        </span>
                                    </div>

                                    {/* 🔥 PROGRESS BAR */}
                                    <div className="mt-4">
                                        <div className="w-full h-4 md:h-5 bg-zinc-700/40 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-teal-400 transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* 🔥 STATUS TEXT (IMPORTANT UX) */}
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-xs text-zinc-400">
                                            {progress === 100
                                                ? "Completed 🎉"
                                                : progress > 0
                                                    ? "In progress"
                                                    : "Not started"}
                                        </p>

                                        <button
                                            onClick={async (e) => {
                                                e.stopPropagation(); // prevent card click

                                                const confirmDelete = confirm("Delete this plan?");
                                                if (!confirmDelete) return;

                                                await fetch(`/api/plans/${plan._id}`, {
                                                    method: "DELETE",
                                                });

                                                // refresh UI
                                                setPlans((prev) => prev.filter(p => p._id !== plan._id));
                                            }}
                                            className="text-xs text-red-400 bg-red-900/10 hover:bg-red-900/20 px-3 py-1 rounded-md transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}