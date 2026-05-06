import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";
import { generateTasks } from "@/lib/ruleEngine";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { goal, level, days } = await req.json();

        const existing = await Plan.findOne({
            goal: goal.trim(),
            userId: session.user.email,
        });

        if (existing) {
            return NextResponse.json({ error: "Plan already exists" }, { status: 400 });
        }

        const tasksData = generateTasks(goal, level, days);

        const plan = await Plan.create({
            goal,
            level,
            duration: days,
            userId: session.user.email, // 🔥 IMPORTANT
        });

        const tasks = tasksData.map((task) => ({
            ...task,
            planId: plan._id,
        }));

        await Task.insertMany(tasks);

        return NextResponse.json({ success: true, planId: plan._id });
    } catch (error) {
        console.error("GENERATE PLAN ERROR:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
