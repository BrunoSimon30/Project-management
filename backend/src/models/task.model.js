import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        required: true,
        default: "pending",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true,
        default: "low",
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    dueDate: {
        type: String,
        required: true,
    },
    assigneeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);