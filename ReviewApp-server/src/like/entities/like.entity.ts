import { User } from "src/users/entities/user.entity";
import { Review } from "src/review/entities/review.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Unique } from "typeorm";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id_like: number;

    // A user can like many reviews
    @ManyToOne(() => User, (user) => user.likes, { eager: true })
    user: User;

    // A review can have many likes
    @ManyToOne(() => Review, (review) => review.likes, { onDelete: 'CASCADE' })
    review: Review;

    @CreateDateColumn()
    likedAt: Date;
}
