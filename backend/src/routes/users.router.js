import { Router } from "express";
import { getAllUsers, userDelete, userUpdate } from "../controllers/users.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const usersRouter = Router();

usersRouter.route("/all").get(authMiddleware,  getAllUsers);
usersRouter.route("/delete/:id").delete(authMiddleware, userDelete);
usersRouter.route("/update/:id").put(authMiddleware, userUpdate);

export default usersRouter;