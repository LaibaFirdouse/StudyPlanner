// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Plan from "@/lib/models/Plan";
// import Task from "@/lib/models/Task";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET() {
//     try {
//         await connectDB();

//         // 🔥 GET SESSION FIRST (YOU MISSED THIS ORDER)
//         const session = await getServerSession(authOptions);

//         if (!session?.user?.email) {
//             return NextResponse.json({ plans: [] });
//         }

//         // 🔥 FILTER BY USER
//         const plans = await Plan.find({
//             userId: session.user.email,
//         }).sort({ createdAt: -1 });

//         // 🔥 CALCULATE PROGRESS
//         const plansWithProgress = await Promise.all(
//             plans.map(async (plan) => {
//                 const tasks = await Task.find({ planId: plan._id });

//                 const total = tasks.length;
//                 const completed = tasks.filter((t) => t.completed).length;

//                 const progress =
//                     total === 0 ? 0 : Math.round((completed / total) * 100);

//                 return {
//                     ...plan.toObject(),
//                     progress,
//                 };
//             })
//         );

//         return NextResponse.json({ plans: plansWithProgress });

//     } catch (err) {
//         console.error("PLANS FETCH ERROR:", err);

//         return NextResponse.json(
//             { error: "Failed to fetch plans" },
//             { status: 500 }
//         );
//     }
// }
import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ plans: [] });
        }

        const plans = await Plan.find({
            userId: session.user.email,
        }).sort({ createdAt: -1 });

        // 🔥 ADD REAL PROGRESS CALCULATION
        const plansWithProgress = await Promise.all(
            plans.map(async (plan) => {
                const tasks = await Task.find({ planId: plan._id });

                const completed = tasks.filter((t) => t.completed).length;
                const progress =
                    tasks.length === 0
                        ? 0
                        : Math.round((completed / tasks.length) * 100);

                return {
                    ...plan.toObject(),
                    progress,
                };
            })
        );

        return NextResponse.json({ plans: plansWithProgress });
    } catch (error) {
        console.error("PLANS FETCH ERROR:", error);
        return NextResponse.json({ plans: [] });
    }
}