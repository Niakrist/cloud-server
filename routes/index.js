import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import userRoutes from "./userRoutes.js";

const router = new Router();

router.use("/user", userRoutes);

export default router;
