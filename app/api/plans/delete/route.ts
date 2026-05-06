import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId } = await req.json();

        const plan = await Plan.findOne({
            _id: planId,
            userId: session.user.email,
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

        await Task.deleteMany({ planId });
        await Plan.deleteOne({ _id: planId });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE PLAN ERROR:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}