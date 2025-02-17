import express from "express";
import { config } from "dotenv";
import cors from "cors";

import sequelize from "./db.js";
import models from "./models/models.js";
import router from "./routes/index.js";

config();
const PORT = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
start();
