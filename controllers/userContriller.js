import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/models.js";

class UserController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        throw new Error(`Пользователь с ${email}  - существует`);
      }
      const hasPassword = await bcrypt.hash(password, 6);
      const user = await User.create({ email, password: hasPassword });

      return res.json({
        message: `Пользователь ${user.email} успешно зарегистрирован`,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  }
  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: `Пользователь с email: ${email} не найден ` });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res.status(400).json({ message: `Не верный пароль` });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  }
}

export default new UserController();
