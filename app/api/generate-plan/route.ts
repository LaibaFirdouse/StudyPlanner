
// import { connectDB } from "@/lib/db";
// import Plan from "@/lib/models/Plan";
// import Task from "@/lib/models/Task";
// import { generateTasks } from "@/lib/ruleEngine";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         // ✅ THIS is where you add your input
//         const { goal, level, days } = await req.json();

//         if (!goal || !level || !days) {
//             return NextResponse.json(
//                 { error: "Missing fields" },
//                 { status: 400 }
//             );
//         }
//         const session = await getServerSession(authOptions);
//         if (!session?.user?.email) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         // ✅ RULE ENGINE CALL (THIS is your main logic)
//         const tasksData = generateTasks(goal, level, days);

//         // ✅ CREATE PLAN
//         const plan = await Plan.create({
//             userId: session.user.email,
//             goal,
//             duration: days,
//             level,
//         });

//         // ✅ CREATE TASKS
//         await Task.insertMany(
//             tasksData.map((t: any) => ({
//                 planId: plan._id,
//                 day: t.day,
//                 title: t.title,
//                 completed: false,
//             }))
//         );

//         return NextResponse.json({ planId: plan._id });

//     } catch (err) {
//         console.error("GENERATE PLAN ERROR:", err);
//         return NextResponse.json(
//             { error: "Server error" },
//             { status: 500 }
//         );
//     }
// }
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
