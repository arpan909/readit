import { IsEmail, Length } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

import bcrypt from "bcrypt";
import { classToPlain, Exclude } from "class-transformer";

@Entity("users")
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Length(3, 255, { message: "Username must be atleast 3 characters long!!" })
  @Column({ unique: true })
  userName: string;

  @IsEmail(undefined, { message: "Email is unvalid!!" })
  @Index()
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Password must be atleast 6 characters long!!" })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPass() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  toJSON() {
    return classToPlain(this);
  }
}
