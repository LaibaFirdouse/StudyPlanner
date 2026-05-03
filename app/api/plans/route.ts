// import { connectDB } from "@/lib/db";
// import Plan from "@/lib/models/Plan";
// import { NextResponse } from "next/server";


// export async function GET() {
//     await connectDB();

//     const plans = await Plan.find().sort({ createdAt: -1 });

//     return NextResponse.json({ plans });
// }
import Task from "@/lib/models/Task";
import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const plans = await Plan.find().sort({ createdAt: -1 });

        const plansWithProgress = await Promise.all(
            plans.map(async (plan) => {
                const tasks = await Task.find({ planId: plan._id });

                const completed = tasks.filter(t => t.completed).length;
                const total = tasks.length;

                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

                return {
                    ...plan.toObject(),
                    progress,
                };
            })
        );

        return NextResponse.json({ plans: plansWithProgress });

    } catch (error) {
        console.error("PLANS ERROR:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}