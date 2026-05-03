// // import { connectDB } from "@/lib/db";
// // import Task from "@/lib/models/Task";
// // import { NextResponse } from "next/server";

// // export async function PATCH(req: Request) {
// //     await connectDB();

// //     const { taskId } = await req.json();

// //     const task = await Task.findById(taskId);

// //     task.completed = !task.completed;
// //     await task.save();

// //     return NextResponse.json({ success: true });
// // }
// import { connectDB } from "@/lib/db";
// import Task from "@/lib/models/Task";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// export async function PATCH(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();
//         const { taskId } = body;

//         if (!mongoose.Types.ObjectId.isValid(taskId)) {
//             return NextResponse.json({ error: "Invalid taskId" }, { status: 400 });
//         }

//         const task = await Task.findById(taskId);

//         if (!task) {
//             return NextResponse.json({ error: "Task not found" }, { status: 404 });
//         }

//         task.completed = !task.completed;
//         await task.save();

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         console.error("TASK PATCH ERROR:", error);
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }
import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const { taskId } = await req.json();

        if (!taskId) {
            return NextResponse.json(
                { error: "Missing taskId" },
                { status: 400 }
            );
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            );
        }

        // 🔥 TOGGLE LOGIC
        task.completed = !task.completed;

        await task.save();

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("TASK PATCH ERROR:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}