import { Request, Response, Router } from "express";
import { Post } from "../entities/Post";
import { Sub } from "../entities/Sub";
import auth2 from "../middleware/auth2";
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

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOne({ name });
    if (!sub) {
      return res.status(404).json({ error: "Sub Not found" });
    }
    const posts = await Post.find({
      order: { createdAt: "DESC" },
      where: { sub },
      relations: ["comment", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    return res.json(sub);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const router = Router();
router.post("/", auth2, authMidd, createSub);
router.get("/:name", auth2, getSub);

export default router;
