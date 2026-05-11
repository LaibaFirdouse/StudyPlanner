import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
        },

        day: Number,

        title: String,

        description: String,

        completed: {
            type: Boolean,
            default: false,
        },
        resources: [
            {
                title: String,
                url: String,
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Task ||
    mongoose.model("Task", TaskSchema);