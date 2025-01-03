import { User } from "src/users/entities/user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id_reply: number;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Each reply belongs to a single comment
  @ManyToOne(() => Comment, (comment) => comment.replies, { eager: true, onDelete: "CASCADE" })
  comment: Comment;

  // Each reply belongs to a single user
  @ManyToOne(() => User, (user) => user.replies, { eager: true })
  user: User;
}
