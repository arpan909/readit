import { IsEmail, Length } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from "typeorm";

import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import { Post } from "./Post";

@TOEntity("users")
export class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @Length(3, 255, { message: "Must be atleast 3 characters long!!" })
  @Column({ unique: true })
  userName: string;

  @Index()
  @IsEmail(undefined, { message: "Email is unvalid!!" })
  @Length(1, 255, { message: "Email cant be empty!!" })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Must be atleast 6 characters long!!" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPass() {
    this.password = await bcrypt.hash(this.password, 8);
  }
}
