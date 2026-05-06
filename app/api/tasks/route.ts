import { connectDB } from "@/lib/db";
import Task from "@/lib/models/Task";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        // SESSION
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // USER (GET OR CREATE)
        let user = await User.findOne({ email: session.user.email });

        if (!user) {
            user = await User.create({
                email: session.user.email,
                streak: 0,
                lastActive: null,
            });
        }

        // REQUEST DATA
        const { taskId } = await req.json();

        if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
            return NextResponse.json({ error: "Invalid taskId" }, { status: 400 });
        }

        // FIND TASK
        const task = await Task.findById(taskId);

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        // TOGGLE
        const wasCompleted = task.completed;

        task.completed = !task.completed;
        await task.save();

        // STREAK 
        if (!wasCompleted && task.completed) {
            const today = new Date();
            const lastActive = user.lastActive;

            if (!lastActive) {
                user.streak = 1;
            } else {
                const diff = Math.floor(
                    (today.getTime() - new Date(lastActive).getTime()) /
                    (1000 * 60 * 60 * 24)
                );

                if (diff === 1) {
                    user.streak += 1;
                } else if (diff > 1) {
                    user.streak = 1;
                }
            }

            user.lastActive = today;
            await user.save();
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("TASK PATCH ERROR:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}