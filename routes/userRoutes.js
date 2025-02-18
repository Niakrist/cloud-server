import { Router } from "express";
import { check } from "express-validator";
import userContriller from "../controllers/userContriller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = new Router();

router.post(
  "/registration",
  [
    check("email", "Uncorrect email").isEmail(),
    check("password", "Длинна пароля должна быть от 3 до 12 символов").isLength(
      { min: 3, max: 12 }
    ),
  ],
  userContriller.registration
);
router.post("/login", userContriller.login);
router.get("/auth", auth, userContriller.auth);

export default router;
