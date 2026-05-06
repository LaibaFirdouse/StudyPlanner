// import mongoose from "mongoose";

// const PlanSchema = new mongoose.Schema({
//     // userId: { type: mongoose.Schema.Types.ObjectId, required: false },
//     goal: String,
//     duration: Number,
//     level: String,
//     createdAt: { type: Date, default: Date.now },
//     userId: {
//         type: String,
//         required: true,
//     }
// });

// export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
    {
        goal: String,
        level: String,
        duration: Number,

        userId: {
            type: String,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);