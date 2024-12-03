import { Injectable, NotFoundException, ForbiddenException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/review/entities/review.entity';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Review)
        private reviewRepository: Repository<Review>

        , @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async create(create: CreateCommentDto): Promise<Comment> {

        const review = await this.reviewRepository.findOne({
            where: { id_review: create.id_review }
        })

        if (!review) {
            throw new NotFoundException(`Review with ID ${create.id_review} not found`);
        }

        const user = await this.userRepository.findOne({
            where: { id_user: create.id_user },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${create.id_user} not found`);
        }

        const comment = this.commentRepository.create({
            text: create.text,
            review,
            user,
        });


        return await this.commentRepository.save(comment);
    }

    async deleteComment(id_comment: number, req: any): Promise<void> {
        const user: User = req.user
        const comment = await this.commentRepository.findOne({
            where: { id_comment },
            relations: ['user'],
        });

        if (!comment) {
            throw new NotFoundException(`Review with ID ${id_comment} not found`);
        }

        if (comment.review.user.id_user !== user.id_user) {
            throw new ForbiddenException('You can only delete your own comments!');
        }

        const result = await this.commentRepository.delete(id_comment);
        if (result.affected === 0) {
            throw new NotFoundException(`Review with ID ${id_comment} not found`);
        }

    }

    async findReviewComments(id_review: number): Promise<Comment[]> {
        try {
            const reviewComments = await this.commentRepository.find({
                where: {
                    review: { id_review: id_review },
                },
                relations: ['review', 'user'],
            });
            return reviewComments;
        } catch (error) {
            throw new Error(`Failed to fetch review comments: ${error.message}`);
        }
    }


    async findOne(id_comment: number): Promise<Comment> {

        const comment = await this.commentRepository.findOne({
            where: { id_comment: id_comment }
        })

        if (!comment) {
            throw new NotFoundException(`Review with ID ${id_comment} not found`);
        }

        return comment
    }

    async findAll(): Promise<Comment[]> {
        const allComments = await this.commentRepository.find({ relations: ["user"] })
        if (!allComments) {
            return []
        }
        return allComments
    }


}
