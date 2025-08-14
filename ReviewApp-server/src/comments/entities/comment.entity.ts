import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id_comment: number;

  @Column()
  text: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  // Many comments can belong to one review
  @ManyToOne(() => Review, (review) => review.comments, {
    onDelete: 'CASCADE',
  })
  review: Review;

  // Many comments can belong to one user
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;

  // Self-referencing parent comment
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Comment;

  // Replies to this comment
  @OneToMany(() => Comment, (comment) => comment.parent, { cascade: true })
  replies: Comment[];
}
