import { Comment } from 'src/comments/entities/comment.entity';
import { Review } from 'src/review/entities/review.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Like } from 'src/like/entities/like.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column({
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  })
  avatar: string;

  @Column({ nullable: true })
  avatarPublicId: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose()
  @Column({ default: 'user' })
  role: string;

  // one user can have many reviews
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  // one user can have many comments
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  // A user can like many reviews
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];
}
