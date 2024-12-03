import { User } from "src/users/entities/user.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Many reviews can belong to one user
    @ManyToOne(() => User, (user) => user.reviews, { eager: true })
    user: User;

    // One review can have many comments
    @OneToMany(() => Comment, (comment) => comment.review)
    comments: Comment[];
}
