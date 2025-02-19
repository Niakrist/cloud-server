import fs from "fs";
import { File } from "../models/models.js";

class FileServices {
  createDir(file, userId) {
    const filePath = `${process.env.filePath}/${userId}/${file.path}`;

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "Файл создан" });
        } else {
          return reject({ message: "Такой файл уже существует" });
        }
      } catch (error) {
        return reject({ message: "File error" });
      }
    });
  }
}

export default new FileServices();
