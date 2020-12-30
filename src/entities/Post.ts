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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "userName", referencedColumnName: "userName" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = string_to_slug(this.title, "_");
  }
}
