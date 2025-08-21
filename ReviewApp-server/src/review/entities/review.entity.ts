import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from 'src/like/entities/like.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id_review: number;

  @Column()
  reviewname: string;

  @Column()
  reviewDescription: string;

  @Column('decimal', { precision: 5, scale: 2 })
  reviewRating: number;

  @Column()
  imageUrl: string;

  @Column()
  category: string;

  @Column('text', { array: true })
  reviewTaste: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many reviews can belong to one user
  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  // One review can have many comments
  @OneToMany(() => Comment, (comment) => comment.review, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  // A review can have many likes
  @OneToMany(() => Like, (like) => like.review, { onDelete: 'CASCADE' })
  likes: Like[];
}
