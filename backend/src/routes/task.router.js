import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/create").post(authMiddleware, createTask);
taskRouter.route("/delete/:id").delete(authMiddleware, deleteTask);
taskRouter.route("/update/:id").put(authMiddleware, updateTask);
taskRouter.route("/get-all").get(authMiddleware, getTasks);
taskRouter.route("/get/:id").get(authMiddleware, getTaskById);
 

export default taskRouter;