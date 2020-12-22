import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";

dotenv.config();

import router from "./routes/auth";
import trim from "./middleware/trim";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

app.use("/api/auth/", router);
app.get("/", (req, res) => {
  res.send("Hello WOrld!");
});

app.listen(5000, async () => {
  console.log("Server started at http://localhost:/5000");
  try {
    await createConnection();
    console.log("Database Connected!");
  } catch (err) {
    console.log(err);
  }
});
