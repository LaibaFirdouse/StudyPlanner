"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PlanPage() {
    const params = useParams();
    const id = params.id as string;

    const [plan, setPlan] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
    const handleToggle = async (taskId: string) => {
        try {
            const res = await fetch("/api/tasks", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId }),
            });

            if (!res.ok) throw new Error("Toggle failed");

            setTasks((prev) =>
                prev.map((t) =>
                    t._id === taskId
                        ? { ...t, completed: !t.completed }
                        : t
                )
            );
        } catch (err) {
            console.error("Toggle error:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
            <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow">

                {/* HEADER */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-800">
                        {plan.goal}
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        {plan.duration} days • {plan.level}
                    </p>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* TASK LIST */}
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            onClick={() => handleToggle(task._id)}
                            className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-200
      ${task.completed
                                    ? "bg-green-50 border-green-300"
                                    : "bg-white hover:shadow-md"
                                }`}
                        >
                            <span
                                className={`text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-800"
                                    }`}
                            >
                                Day {task.day}: {task.title}
                            </span>

                            <span className="text-lg">
                                {task.completed ? "✅" : "⬜"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}