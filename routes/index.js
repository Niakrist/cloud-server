import { Router } from "express";
import userRoutes from "./userRoutes.js";
import fileRouters from "./fileRouters.js";

const router = new Router();

router.use("/user", userRoutes);
router.use("/files", fileRouters);

export default router;
