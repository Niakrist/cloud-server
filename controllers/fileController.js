import fileServices from "../services/fileServices.js";
import { File, User } from "../models/models.js";

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const userId = req.user.id; // Получаем ID пользователя из req.user

      let file;
      let parentFile;

      if (parent) {
        // Проверяем, указан ли parent
        parentFile = await File.findOne({ where: { id: parent } });

        if (!parentFile) {
          return res
            .status(400)
            .json({ message: "Родительская директория не найдена" });
        }
      }

      // Создаем запись File
      if (parentFile) {
        file = await File.create({
          name,
          type,
          parent,
          user: userId,
          path: `${parentFile.path}/${name}`,
          userId: userId,
        });
      } else {
        file = await File.create({
          name,
          type,
          parent: null,
          user: userId,
          path: name,
          userId: userId,
        }); // parent: null, если корневая
      }

      await fileServices.createDir(file, userId); // Передаем file и userId

      if (parentFile) {
        parentFile.childs = parentFile.childs || []; // Инициализируем childs, если он undefined
        parentFile.childs.push(file.id);
        await parentFile.save();
      }

      return res.json(file);

      // try {
      //   const { name, type, parent } = req.body;

      //   const file = await File.create({ name, type, parent, user: req.user.id });
      //   let parentFile;

      //   if (parent) {
      //     parentFile = await File.findOne({ where: { id: parent } });
      //   }

      //   if (!parentFile) {
      //     file.path = name;
      //     await fileServices.createDir(file);
      //   } else {
      //     file.path = `${parentFile.path}/${file.name}`;
      //     await fileServices.createDir(file);
      //     parentFile.childs.push(file.id);
      //     await parentFile.save();
      //   }
      //   await file.save();
      //   return res.json(file);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error });
    }
  }

  async fetFile(req, res) {
    try {
      const user = req.user.id;
      // , parent ? parent: req.query.parent: parent: null
      const files = await File.findAll({
        where: { userId: user },
      });
      return res.json({ files });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Не удалось получить файл" });
    }
  }
}

export default new FileController();
