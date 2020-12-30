import { Request, Response, Router } from "express";
import { Sub } from "../entities/Sub";
import authMidd from "../middleware/authMidd";

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const user = res.locals.user;
  try {
    let errors: any = {};

    //Empty Validation
    if (name.trim() === "") errors.name = "Name cant be empty!";
    if (title.trim() === "") errors.title = "Title cant be empty!";

    //Unique name validation
    const sub = await Sub.findOne({ name: name.toLowerCase() });
    if (sub) errors.name = "Sub already exists!";
    if (Object.keys(errors).length > 0) throw errors;
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, title, description, user });
    await sub.save();
    return res.send(sub);
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const router = Router();
router.post("/", authMidd, createSub);

export default router;
