import { Request, Response, Router } from "express";
import { Comment } from "../entities/Comment";
import { Post } from "../entities/Post";
import { Vote } from "../entities/Votes";
import auth2 from "../middleware/auth2";
import authMidd from "../middleware/authMidd";

const voteRoute = async (req: Request, res: Response) => {
  const { identifier, slug, commentId, value } = req.body;

  if (![-1, 0, 1].includes(value))
    return res.status(404).json({ error: "Value must be -1,0 or 1!" });

  try {
    let post = await Post.findOneOrFail({ identifier, slug });
    const user = res.locals.user;
    let comment: Comment | undefined;
    let vote: Vote | undefined;

    if (commentId) {
      comment = await Comment.findOneOrFail({ identifier: commentId });
      vote = await Vote.findOne({ user, comment });
    } else {
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value == 0) {
      return res.status(404).json({ error: "Vote not found!" });
    } else if (!vote) {
      vote = new Vote({ user, value });
      if (comment) vote.comment = comment;
      else {
        vote.post = post;
      }
      await vote.save();
    } else if (value == 0) {
      await vote.remove();
    } else if (vote.value != value) {
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ["comment", "comment.votes", "votes", "sub"] }
    );

    post.setUserVote(user);
    post.comment.forEach((c) => c.setUserVote(user));
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const router = Router();
router.post("/vote", auth2, authMidd, voteRoute);
export default router;
