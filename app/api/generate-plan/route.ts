
import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { generateTasks } from "@/lib/ruleEngine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        // ✅ THIS is where you add your input
        const { goal, level, days } = await req.json();

        if (!goal || !level || !days) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        // ✅ RULE ENGINE CALL (THIS is your main logic)
        const tasksData = generateTasks(goal, level, days);

        // ✅ CREATE PLAN
        const plan = await Plan.create({
            userId: null,
            goal,
            duration: days,
            level,
        });

        // ✅ CREATE TASKS
        await Task.insertMany(
            tasksData.map((t: any) => ({
                planId: plan._id,
                day: t.day,
                title: t.title,
                completed: false,
            }))
        );

        return NextResponse.json({ planId: plan._id });

    } catch (err) {
        console.error("GENERATE PLAN ERROR:", err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
