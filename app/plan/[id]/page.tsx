"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";



export default function PlanPage() {
    const params = useParams();
    const id = params.id as string;

    const [plan, setPlan] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 🔹 FETCH PLAN + TASKS
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/plans/${id}`);

                if (!res.ok) throw new Error("Failed to fetch plan");

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

    // 🔹 LOADING STATE
    if (loading) return <div className="p-6">Loading...</div>;
    if (!plan) return <div className="p-6">Plan not found</div>;

    // 🔹 PROGRESS CALCULATION
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const progress = total ? (completed / total) * 100 : 0;

    // 🔹 TOGGLE TASK
    // const handleToggle = async (taskId: string) => {
    //     try {
    //         const res = await fetch("/api/tasks", {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ taskId }),
    //         });

    //         if (!res.ok) throw new Error("Toggle failed");

    //         // optimistic UI update
    //         setTasks((prev) =>
    //             prev.map((t) =>
    //                 t._id === taskId ? { ...t, completed: !t.completed } : t
    //             )
    //         );
    //     } catch (err) {
    //         console.error("TOGGLE ERROR:", err);
    //     }
    // };
    // const handleToggle = async (taskId: string) => {
    //     try {
    //         const res = await fetch("/api/tasks", {
    //             method: "PATCH",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ taskId }),
    //         });

    //         if (!res.ok) throw new Error("Toggle failed");

    //         setTasks((prev) =>
    //             prev.map((t) =>
    //                 t._id === taskId
    //                     ? { ...t, completed: !t.completed }
    //                     : t
    //             )
    //         );
    //     } catch (err) {
    //         console.error("Toggle error:", err);
    //     }
    // };
    const handleToggle = async (taskId: string) => {
        try {
            await fetch("/api/tasks", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ taskId }),
            });

            // 🔥 INSTANT UI UPDATE
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
            <div className="w-full max-w-2xl p-8 rounded-3xl bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/6 shadow-2xl">

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {plan.goal}
                    </h1>

                    <p className="text-sm text-zinc-400 mt-2">
                        {plan.duration} days • {plan.level}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm text-zinc-400 mb-2">
                        <span>Progress</span>
                        <span className="text-white font-medium">{Math.round(progress)}%</span>
                    </div>

                    <div className="w-full h-3 md:h-4 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-pink-500 via-violet-500 to-teal-400 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* TASK LIST */}
                <div className="space-y-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => handleToggle(task._id)}
                            className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
      ${task.completed
                                    ? "bg-green-900/20 border-green-400 text-zinc-200"
                                    : "bg-white/3 border-white/6 text-white hover:shadow-lg"
                                }`}
                        >
                            <span
                                className={`text-sm ${task.completed ? "line-through text-zinc-300" : "text-white"
                                    }`}
                            >
                                Day {task.day}: {task.title}
                            </span>

                            <span className="text-lg">
                                {task.completed ? "✅" : "⬜"}
                            </span>
                        </div>
                    ))}

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-2 text-sm text-violet-300 hover:text-violet-200"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}