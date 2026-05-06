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