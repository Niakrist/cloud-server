import { Router } from "express";
import fileController from "../controllers/fileController.js";

import { auth } from "../middleware/auth.middleware.js";

const router = new Router();

router.post("", auth, fileController.createDir);
router.get("/", auth, fileController.fetFile);

export default router;
