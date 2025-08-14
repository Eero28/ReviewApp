import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id_like: number;

  // A user can like many reviews
  @ManyToOne(() => User, (user) => user.likes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  // A review can have many likes
  @ManyToOne(() => Review, (review) => review.likes, { onDelete: 'CASCADE' })
  review: Review;

  @Exclude()
  @CreateDateColumn()
  likedAt: Date;
}
