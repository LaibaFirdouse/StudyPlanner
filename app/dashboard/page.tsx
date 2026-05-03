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
                    cache: "no-store", // 🔥 IMPORTANT FIX
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch plans");
                }

                const data = await res.json();
                setPlans(data.plans || []);
            } catch (err) {
                console.error("Failed to fetch plans:", err);
                setPlans([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // 🔹 FORMAT TITLE (clean text)
    const formatTitle = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    // 🔹 LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-zinc-800">
                <p className="text-zinc-400">Loading plans...</p>
            </div>
        );
    }

    // 🔹 EMPTY STATE
    if (plans.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-black via-zinc-900 to-zinc-800 text-white">
                <h2 className="text-2xl font-semibold mb-2">
                    No plans yet
                </h2>

                <p className="text-zinc-400 mb-4 max-w-lg">
                    Create your first study plan to get started — generate a personalized study roadmap in seconds.
                </p>

                <button
                    onClick={() => router.push("/")} // ✅ FIXED
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-5 py-3 rounded-xl shadow-lg hover:brightness-105 transition"
                >
                    Create Plan
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-zinc-800 py-12 px-6 text-white">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold">Your Study Plans</h1>
                        <p className="text-zinc-400 mt-1">Manage and track your active study roadmaps</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            className="bg-white/6 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition"
                            onClick={() => router.push("/")} // ✅ FIXED
                        >
                            + New Plan
                        </button>
                    </div>
                </div>

                {/* PLAN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan: any) => {
                        const progress = plan.progress ?? 0;

                        return (
                            <div
                                key={plan._id}
                                onClick={() => router.push(`/plan/${plan._id}`)} // ✅ FIXED
                                className="p-6 bg-zinc-900/60 border border-white/6 rounded-2xl shadow-lg hover:scale-[1.01] transition cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-semibold capitalize">{formatTitle(plan.goal)}</h2>
                                        <p className="text-sm text-zinc-400 mt-1">{plan.duration} days • {plan.level}</p>
                                    </div>
                                    <div className="text-sm text-zinc-300">{progress}%</div>
                                </div>

                                <div className="mt-4">
                                    <div className="w-full h-3 bg-white/8 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-violet-400 to-teal-400 transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}