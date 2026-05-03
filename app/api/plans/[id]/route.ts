// import { connectDB } from "@/lib/db";
// import Plan from "@/lib/models/Plan";
// import Task from "@/lib/models/Task";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function GET(
//     req: Request,
//     context: { params: Promise<{ id: string }> }
// ) {
//     await connectDB();

//     const { id } = await context.params;

//     console.log("ID:", id);

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//     }

//     const plan = await Plan.findById(id);
//     const tasks = await Task.find({ planId: id }).sort({ day: 1 });

//     return NextResponse.json({ plan, tasks });
// }
import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        const plan = await Plan.findById(id);
        const tasks = await Task.find({ planId: id }).sort({ day: 1 });

        return NextResponse.json({ plan, tasks });
    } catch (error) {
        console.error("PLAN API ERROR:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}