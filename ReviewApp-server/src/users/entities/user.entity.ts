import { Comment } from "src/comments/entities/comment.entity";
import { Review } from "src/review/entities/review.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Like } from "src/like/entities/like.entity";
import {Reply} from '../../reply/entities/reply.entity'
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column()
    password: string;
    
    @Column({unique: true})
    email: string;

    @Column()
    username: string;

    @Column({default: "user"})
    role: string;

    // one user can have many reviews
    @OneToMany(() => Review, (review) => review.user)
    reviews: Review[];

    // one user can have many comments 
    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    // One user can have many replies
    @OneToMany(() => Reply, (reply) => reply.user)
    replies: Reply[]; // Add this property to store the replies the user has made

    // A user can like many reviews
    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];
}
