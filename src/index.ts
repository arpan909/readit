import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";

import trim from "./middleware/trim";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth/", authRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/subs/", subRoutes);

app.get("/", (_, res) => {
  res.send("Hello WOrld!");
});

app.listen(5001, async () => {
  console.log("Server started at http://localhost:/5001");
  try {
    await createConnection();
    console.log("Database Connected!");
  } catch (err) {
    console.log(err);
  }
});
