import {
  Entity as TOEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import Entity from "./Entity";
import { makeId, string_to_slug } from "../utils/helper";
import { Post } from "./Post";

@TOEntity("subs")
export class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userName", referencedColumnName: "userName" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];
}
