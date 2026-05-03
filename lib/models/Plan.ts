import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: false },
    goal: String,
    duration: Number,
    level: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);