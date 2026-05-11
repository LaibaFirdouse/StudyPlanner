"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PlanPage() {

    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [plan, setPlan] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // EXPANDABLE TASK STATE
    const [openTask, setOpenTask] = useState<string | null>(null);

    // FETCH PLAN + TASKS
    useEffect(() => {

        if (!id) return;

        const fetchData = async () => {

            try {

                const res = await fetch(`/api/plans/${id}`, {
                    cache: "no-store",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch plan");
                }

                const data = await res.json();

                setPlan(data.plan);
                setTasks(data.tasks);

            } catch (err) {

                console.error("FETCH ERROR:", err);

            } finally {

                setLoading(false);

            }
        };

        fetchData();

    }, [id]);

    // LOADING
    if (loading) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    // PLAN NOT FOUND
    if (!plan) {

        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Plan not found
            </div>
        );
    }

    // REALTIME PROGRESS
    const completedTasks = tasks.filter((t) => t.completed).length;

    const progress =
        tasks.length === 0
            ? 0
            : Math.round((completedTasks / tasks.length) * 100);

    // TOGGLE TASK
    const handleToggle = async (taskId: string) => {

        try {

            await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId }),
            });

            // INSTANT UI UPDATE
            setTasks((prev: any[]) =>
                prev.map((t) =>
                    t._id === taskId
                        ? { ...t, completed: !t.completed }
                        : t
                )
            );

        } catch (error) {

            console.error(error);

        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-b from-[#04040a] via-[#0b0b0f] to-[#04040a] flex justify-center py-12 px-4">

            <div className="w-full max-w-3xl p-8 rounded-3xl bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/6 shadow-2xl">

                {/* BACK BUTTON */}
                <button
                    onClick={() => router.push("/dashboard")}
                    className="mb-8 text-sm text-violet-300 hover:text-violet-200 transition"
                >
                    ← Back to Dashboard
                </button>

                {/* PLAN HEADER */}
                <div className="mb-8">

                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight capitalize">
                        {plan.goal}
                    </h1>

                    <p className="text-zinc-400 mt-3">
                        {plan.duration} day roadmap • {plan.level}
                    </p>

                </div>

                {/* PROGRESS */}
                <div className="mb-8">

                    <div className="flex justify-between text-sm text-zinc-400 mb-2">

                        <span>Progress</span>

                        <span className="text-white font-medium">
                            {progress}%
                        </span>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                        <div
                            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-teal-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />

                    </div>

                </div>

                {/* TASK LIST */}
                <div className="space-y-5 mt-6">

                    {tasks.map((task) => (

                        <div
                            key={task._id}

                            // EXPAND CARD
                            onClick={() =>
                                setOpenTask(
                                    openTask === task._id
                                        ? null
                                        : task._id
                                )
                            }

                            className={`border rounded-2xl p-5 transition-all duration-200 cursor-pointer

                            ${task.completed
                                    ? "border-green-500/30 bg-green-500/10"
                                    : "border-white/10 bg-white/[0.03] hover:border-violet-500/30 hover:bg-white/[0.05]"
                                }`}
                        >

                            <div className="flex items-start justify-between gap-4">

                                {/* LEFT */}
                                <div className="flex-1">

                                    <p className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                                        Day {task.day}
                                    </p>

                                    <h3
                                        className={`text-lg font-medium leading-snug

                                        ${task.completed
                                                ? "line-through opacity-50 text-zinc-400"
                                                : "text-white"
                                            }`}
                                    >
                                        {task.title}
                                    </h3>

                                    {/* DESCRIPTION */}
                                    {task.description && (

                                        <p
                                            className={`text-sm mt-3 leading-relaxed

                                            ${task.completed
                                                    ? "text-zinc-500"
                                                    : "text-zinc-300"
                                                }`}
                                        >
                                            {task.description}
                                        </p>
                                    )}

                                    {/* STATUS */}
                                    <p className="text-xs mt-4 text-zinc-500">

                                        {task.completed
                                            ? "✅ Completed"
                                            : "⚡ In Progress"}

                                    </p>

                                    {/* EXPANDED RESOURCES */}
                                    {openTask === task._id && (

                                        <div className="mt-5 border-t border-white/10 pt-4">

                                            <h4 className="text-sm font-semibold text-white mb-3">
                                                Resources
                                            </h4>

                                            <div className="space-y-2">

                                                {task.resources?.length > 0 ? (

                                                    task.resources.map(
                                                        (resource: any, index: number) => (

                                                            <a
                                                                key={index}
                                                                href={resource.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="block text-sm text-violet-300 hover:text-violet-200 underline"
                                                            >
                                                                {resource.title}
                                                            </a>
                                                        )
                                                    )

                                                ) : (

                                                    <p className="text-sm text-zinc-500">
                                                        No resources available
                                                    </p>

                                                )}

                                            </div>

                                        </div>
                                    )}

                                </div>

                                {/* TOGGLE BUTTON */}
                                <button

                                    // LOCK TASK ORDER
                                    disabled={
                                        task.day > 1 &&
                                        !tasks.find(
                                            (t) => t.day === task.day - 1
                                        )?.completed
                                    }

                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggle(task._id);
                                    }}

                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition

                                    ${task.day > 1 &&
                                            !tasks.find(
                                                (t) => t.day === task.day - 1
                                            )?.completed
                                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"

                                            : task.completed
                                                ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"

                                                : "bg-violet-500/20 text-violet-200 hover:bg-violet-500/30"
                                        }`}
                                >
                                    {task.completed ? "Done" : "Mark"}
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}