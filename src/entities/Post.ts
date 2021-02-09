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
import { makeId, string_to_slug } from "../utils/helper";
import { Sub } from "./Sub";
import { Comment } from "./Comment";
import { Exclude, Expose } from "class-transformer";
import { Vote } from "./Votes";

@TOEntity("posts")
export class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 Character Id

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @Column()
  userName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "userName", referencedColumnName: "userName" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose()
  public get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @Expose()
  public get commentCount(): number {
    return this.comment?.length;
  }

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
    this.identifier = makeId(7);
    this.slug = string_to_slug(this.title, "_");
  }
}
