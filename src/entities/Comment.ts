import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";

import { User } from "./User";
import Entity from "./Entity";
import { Post } from "./Post";

import { makeId } from "../utils/helper";
import { Vote } from "./Votes";
import { Expose } from "class-transformer";

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

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose()
  public get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes.findIndex((v) => v.userName === user.userName);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
