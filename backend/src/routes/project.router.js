import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { uploadFiler } from "../utils/fileFilter.js";
const projectRouter = Router();

projectRouter.route("/create").post(authMiddleware ,uploadFiler.single("projectIcon"), createProject);
projectRouter.route("/get-projects").get(authMiddleware, getProjects);
projectRouter.route("/get-project/:id").get(authMiddleware, getProjectById);
projectRouter.route("/update/:id").put(authMiddleware, uploadFiler.single("projectIcon"), updateProject);
projectRouter.route("/delete/:id").delete(authMiddleware, deleteProject);

export default projectRouter;