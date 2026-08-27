import { Router } from "express";
import authRouter from "./auth.router.js";
import departmentRouter from "./department.router.js";
import usersRouter from "./users.router.js";
import projectRouter from "./project.router.js";
import taskRouter from "./task.router.js";

const Routes = () => {
  const router = Router();

  router.use("/auth", authRouter);
  router.use("/department", departmentRouter);
  router.use("/users", usersRouter);
  router.use("/project", projectRouter);
  router.use("/task", taskRouter);
  return router;
};

export default Routes;
