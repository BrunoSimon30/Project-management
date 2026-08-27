import { z } from "zod";

const createTaskValidator = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
    priority: z.enum(["low", "medium", "high"]),
    projectId: z.string().min(1, "Project is required"),
    assigneeId: z.string().min(1, "Assignee is required"),
    dueDate: z.string().min(1, "Due date is required"),
});

export { createTaskValidator };