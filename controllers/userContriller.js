import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User, File } from "../models/models.js";
import fileServices from "../services/fileServices.js";

class UserController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        throw new Error(`Пользователь с ${email}  - существует`);
      }
      const hasPassword = await bcrypt.hash(password, 6);
      const user = await User.create({ email, password: hasPassword });

      const rootDir = await File.create({
        user: user.id,
        name: email, // Используем email как имя корневой директории
        type: "dir", // Укажите тип "dir"
        accessLink: "", // Или что-то подходящее
        size: 0, // Размер директории
      });

      await fileServices.createDir(rootDir, user.id);

      // await fileServices.createDir(
      //   File.create({ where: { userId: user.id, name: user.id } })
      // );

      return res.json({
        message: `Пользователь ${user.email} успешно зарегистрирован`,
      });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Не введен email" });
      }

      if (!password) {
        return res.status(400).json({ message: "Не введен password" });
      }

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
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }

  async auth(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
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
    } catch (error) {
      console.log("error: ", error);
      return res.status(400).json({ message: error });
    }
  }
}

export default new UserController();
