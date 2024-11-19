import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id_review: number

    @Column()
    reviewname: string

    @Column()
    reviewDescription: string

    @Column('decimal', { precision: 5, scale: 2 }) 
    reviewRating: number;

    @Column()
    imageUrl: string

    @Column()
    category: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.reviews, { eager: true }) user: User;
}