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
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id_comment: number;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  // Many comments can belong to one review
  @ManyToOne(() => Review, (review) => review.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'review_id' })
  review: Review;

  // Many comments can belong to one user
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Self-referencing parent comment
  @ManyToOne(() => Comment, (comment) => comment.replies, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Comment;

  // Replies to this comment
  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];
}
