import { Router } from "express";
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from "../controllers/department.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const departmentRouter = Router();

departmentRouter
  .route("/create")
  .post(authMiddleware, roleMiddleware(["super_admin"]), createDepartment);
departmentRouter
  .route("/get-departments")
  .get(authMiddleware, roleMiddleware(["super_admin", "admin", "department_head", "project_manager", "team_lead", "team_member"]), getDepartments);
departmentRouter
  .route("/delete/:id")
  .delete(authMiddleware, roleMiddleware(["super_admin", "admin"]), deleteDepartment);
departmentRouter
  .route("/update/:id")
  .put(authMiddleware, roleMiddleware(["super_admin", "admin"]), updateDepartment);


export default departmentRouter;
