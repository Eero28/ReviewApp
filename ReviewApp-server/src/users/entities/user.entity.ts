import { Comment } from "src/comments/entities/comment.entity";
import { Review } from "src/review/entities/review.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";


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
}
