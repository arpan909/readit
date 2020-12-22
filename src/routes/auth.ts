import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/authMidd";

const register = async (req: Request, res: Response) => {
  const { email, userName, password } = req.body;

  try {
    //Validating the username and email
    const emailUser = await User.findOne({ email });
    const userNameUser = await User.findOne({ userName });

    console.log(userNameUser);

    let errors: any = {};
    if (emailUser) {
      errors.email = "Email already taken!";
    }
    if (userNameUser) {
      errors.userName = "Username already taken!";
    }
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);

    //Saving the user
    const user = new User({ email, userName, password });
    errors = await validate(user);
    if (errors.length > 0) return res.status(400).json(errors);
    await user.save();

    //Returning the userdata
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });
  if (!user) return res.status(400).json({ error: "User not found!" });

  const matchPass = await bcrypt.compare(password, user.password);

  if (!matchPass)
    return res.status(400).json({ password: "Pass is incorrect!" });

  const token = jwt.sign({ userName }, "" + process.env.SECRET_KEY);
  res.set(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 36000,
      path: "/",
    })
  );
  return res.status(200).json({ user, token });
};

const me = (req: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (req: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.status(200).send("Logged out!");
};

const router = Router();
router.post("/register", register);
router.get("/login", login);
router.get("/me", auth, me);
router.get("/logout", auth, logout);

export default router;
