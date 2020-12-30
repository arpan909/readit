import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";

import { User } from "./User";
import Entity from "./Entity";
import { Post } from "./Post";

import { makeId } from "../utils/helper";

@TOEntity("comments")
export class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string; // 7 Character Id

  @Column({ type: "text" })
  body: string;

  @Column()
  userName: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userName", referencedColumnName: "userName" })
  user: User;

  @ManyToOne(() => Post, (post) => post.comment, { nullable: false })
  post: Post;

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
