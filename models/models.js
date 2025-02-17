import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  diskSpace: { type: DataTypes.INTEGER, defaultValue: 1024 * 3 * 10 },
  usedSpace: { type: DataTypes.INTEGER, defaultValue: 0 },
  avatar: { type: DataTypes.STRING },
});

const File = sequelize.define("file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  accessLink: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER },
});

User.hasMany(File);
File.belongsTo(User);

const models = {
  User: User,
  File: File,
};

export default models;

export { User, File };
