// // import { NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import Plan from "@/lib/models/Plan";
// // import Task from "@/lib/models/Task";
// // import mongoose from "mongoose";

// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";

// // // 🔥 GET SINGLE PLAN (SECURE)
// // export async function GET(
// //     req: Request,
// //     context: { params: Promise<{ id: string }> }
// // ) {
// //     try {
// //         await connectDB();

// //         const session = await getServerSession(authOptions);

// //         if (!session?.user?.email) {
// //             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //         }

// //         // ✅ FIX: unwrap params first
// //         const { id } = await context.params;

// //         if (!id) {
// //             return NextResponse.json({ error: "Missing ID" }, { status: 400 });
// //         }

// //         if (!mongoose.Types.ObjectId.isValid(id)) {
// //             return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
// //         }

// //         // 🔥 SECURE QUERY (VERY IMPORTANT)
// //         const plan = await Plan.findOne({
// //             _id: id,
// //             userId: session.user.email,
// //         });

// //         if (!plan) {
// //             return NextResponse.json({ error: "Plan not found" }, { status: 404 });
// //         }

// //         const tasks = await Task.find({ planId: id }).sort({ day: 1 });

// //         return NextResponse.json({ plan, tasks });

// //     } catch (error) {
// //         console.error("PLAN API ERROR:", error);

// //         return NextResponse.json(
// //             { error: "Server error" },
// //             { status: 500 }
// //         );
// //     }
// // }

// // // 🔥 DELETE PLAN (ONLY OWNER)
// // export async function DELETE(
// //     req: Request,
// //     context: { params: Promise<{ id: string }> }
// // ) {
// //     try {
// //         await connectDB();

// //         const session = await getServerSession(authOptions);

// //         if (!session?.user?.email) {
// //             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //         }

// //         const { id } = await context.params;

// //         if (!id) {
// //             return NextResponse.json({ error: "Missing ID" }, { status: 400 });
// //         }

// //         if (!mongoose.Types.ObjectId.isValid(id)) {
// //             return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
// //         }

// //         // 🔥 ONLY DELETE IF USER OWNS IT
// //         const plan = await Plan.findOne({
// //             _id: id,
// //             userId: session.user.email,
// //         });

// //         if (!plan) {
// //             return NextResponse.json({ error: "Plan not found" }, { status: 404 });
// //         }

// //         await Task.deleteMany({ planId: id });
// //         await Plan.deleteOne({ _id: id });

// //         return NextResponse.json({ success: true });

// //     } catch (error) {
// //         console.error("DELETE PLAN ERROR:", error);

// //         return NextResponse.json(
// //             { error: "Server error" },
// //             { status: 500 }
// //         );
// //     }
// // }
// import { connectDB } from "@/lib/db";
// import Plan from "@/lib/models/Plan";
// import Task from "@/lib/models/Task";
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function GET(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         await connectDB();

//         const session = await getServerSession(authOptions);

//         if (!session?.user?.email) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         const { id } = params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
//         }

//         const plan = await Plan.findOne({
//             _id: id,
//             userId: session.user.email, // 🔥 SECURITY
//         });

//         if (!plan) {
//             return NextResponse.json({ error: "Plan not found" }, { status: 404 });
//         }

//         const tasks = await Task.find({ planId: id }).sort({ day: 1 });

//         return NextResponse.json({ plan, tasks });
//     } catch (error) {
//         console.error("PLAN DETAILS ERROR:", error);
//         return NextResponse.json({ error: "Server error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Plan from "@/lib/models/Plan";
import Task from "@/lib/models/Task";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const plan = await Plan.findOne({
            _id: id,
            userId: session.user.email,
        });

        if (!plan) {
            return NextResponse.json({ error: "Plan not found" }, { status: 404 });
        }

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

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        await Plan.findOneAndDelete({
            _id: id,
            userId: session.user.email,
        });

        await Task.deleteMany({ planId: id });

        return NextResponse.json({ message: "Deleted successfully" });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}