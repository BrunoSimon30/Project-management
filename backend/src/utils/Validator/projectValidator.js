import { z } from "zod";

const createProjectValidator = z.object({
  name: z.string().min(3, "Project name is required"),
  description: z.string().min(3, "Project description is required"),
  status: z.enum(["not_started", "in_progress", "completed", "on_hold"]),
  startDate: z.union([z.string(), z.coerce.date()]).optional().nullable(),
  endDate: z.union([z.string(), z.coerce.date()]).optional().nullable(),
  department: z.string().optional().nullable(),
  projectManager: z.string().optional().nullable(),
  githubLink: z.string().optional().default(""),
  liveLink: z.string().optional().default(""),
});

const updateProjectValidator = createProjectValidator.partial();

export { createProjectValidator, updateProjectValidator };