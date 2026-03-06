import { Router } from "express";
import authRouter from "./auth.router.js";

const Routes = () => {
  const router = Router();

  router.use("/auth", authRouter);

  return router;
};

export default Routes;
