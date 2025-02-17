import { Router } from "express";
import userRoutes from "./userRoutes.js";

const router = new Router();

router.use("/user", userRoutes);

export default router;
