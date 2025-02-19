import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  diskSpace: { type: DataTypes.BIGINT, defaultValue: 1024 ** 3 * 10 },
  usedSpace: { type: DataTypes.BIGINT, defaultValue: 0 },
  avatar: { type: DataTypes.STRING },
});

const File = sequelize.define("file", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  accessLink: { type: DataTypes.STRING },
  size: { type: DataTypes.BIGINT, defaultValue: 0 },
  path: { type: DataTypes.STRING, defaultValue: "" },
});

User.hasMany(File, { foreignKey: "userId", as: "files" });
File.belongsTo(User, { foreignKey: "userId", as: "user" });

File.belongsTo(File, { foreignKey: "parentId", as: "parent" });
File.hasMany(File, { foreignKey: "parentId", as: "childs" });

const models = {
  User: User,
  File: File,
};

export default models;

export { User, File };
