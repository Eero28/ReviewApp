import { Review } from "src/review/entities/review.entity";
import { User } from "src/users/entities/user.entity";
import {Reply} from '../../reply/entities/reply.entity'
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id_comment: number;

    @Column()
    text: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Many comments can belong to one review
    @ManyToOne(() => Review, (review) => review.comments, { eager: true, onDelete: "CASCADE" })
    review: Review;

    // Many comments can belong to one user
    @ManyToOne(() => User, (user) => user.comments, { eager: true })
    user: User;

    // One comment can have many replies
    @OneToMany(() => Reply, (reply) => reply.comment)
    replies: Reply[];
}
