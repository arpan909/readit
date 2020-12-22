import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("Unauthenticated!!");
    const { userName }: any = jwt.verify(token, "" + process.env.SECRET_KEY);
    const user = await User.findOne({ userName });
    if (!user) throw new Error("Token altered!!!");

    res.locals.user = user;
    return next();
  } catch (err) {
    return res.send({ error: err.message });
  }
};
