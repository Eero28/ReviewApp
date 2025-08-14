import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Review } from 'src/review/entities/review.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<Comment> {
    const review = await this.reviewRepository.findOne({
      where: { id_review: dto.id_review },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${dto.id_review} not found`);
    }

    const user = await this.userRepository.findOne({
      where: { id_user: dto.id_user },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.id_user} not found`);
    }

    let parent: Comment = null;
    if (dto.parentCommentId) {
      parent = await this.commentRepository.findOne({
        where: { id_comment: dto.parentCommentId },
        relations: ['review'],
      });
      if (!parent) throw new NotFoundException(`Parent comment not found`);
      if (parent.review.id_review !== dto.id_review) {
        throw new ForbiddenException(
          'Parent comment must belong to the same review',
        );
      }
    }

    const comment = this.commentRepository.create({
      text: dto.text,
      review,
      user,
      parent,
    });

    return this.commentRepository.save(comment);
  }

  async findReviewComments(id_review: number): Promise<any[]> {
    const comments = await this.commentRepository.find({
      where: { review: { id_review } },
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });

    const commentMap = new Map<number, any[]>();
    const topLevelComments: any[] = [];

    for (const comment of comments) {
      const mapped = {
        id_comment: comment.id_comment,
        text: comment.text,
        isParent: !comment.parent,
        user: comment.user
          ? { id_user: comment.user.id_user, username: comment.user.username }
          : null,
        replies: [],
      };

      if (comment.parent) {
        const parentReplies = commentMap.get(comment.parent.id_comment) || [];
        parentReplies.push(mapped);
        commentMap.set(comment.parent.id_comment, parentReplies);
      } else {
        topLevelComments.push(mapped);
      }
    }

    const attachReplies = (comment: any) => {
      const replies = commentMap.get(comment.id_comment) || [];
      comment.replies = replies.map(attachReplies);
      return comment;
    };

    return topLevelComments.map(attachReplies);
  }

  async findCommentsReplies(id_comment: number) {
    const comment = await this.commentRepository.findOne({
      where: { id_comment },
      relations: ['user', 'parent'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id_comment} not found`);
    }

    const comments = await this.commentRepository.find({
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });

    const commentMap = new Map<number, any[]>();

    for (const commentItem of comments) {
      const mapped = {
        id_comment: commentItem.id_comment,
        text: commentItem.text,
        isParent: !commentItem.parent,
        user: commentItem.user
          ? {
              id_user: commentItem.user.id_user,
              username: commentItem.user.username,
            }
          : null,
        replies: [],
      };

      if (commentItem.parent) {
        const parentReplies =
          commentMap.get(commentItem.parent.id_comment) || [];
        parentReplies.push(mapped);
        commentMap.set(commentItem.parent.id_comment, parentReplies);
      }
    }

    const attachReplies = (commentNode: any) => {
      const replies = commentMap.get(commentNode.id_comment) || [];
      commentNode.replies = replies.map(attachReplies);
      return commentNode;
    };

    const mappedRoot = {
      id_comment: comment.id_comment,
      text: comment.text,
      isParent: !comment.parent,
      user: comment.user
        ? { id_user: comment.user.id_user, username: comment.user.username }
        : null,
      replies: [],
    };

    return [attachReplies(mappedRoot)];
  }

  async deleteComment(
    id_comment: number,
    request: { user: User },
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id_comment },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment not found`);
    }

    if (comment.user.id_user !== request.user.id_user) {
      throw new ForbiddenException('Cannot delete others comments');
    }

    await this.commentRepository.remove(comment);
  }

  async findOne(id_comment: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id_comment },
      relations: ['user', 'parent'],
    });
    if (!comment) throw new NotFoundException(`Comment not found`);
    return comment;
  }

  async findAll(): Promise<any[]> {
    const comments = await this.commentRepository.find({
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });

    const commentMap = new Map<number, any[]>();
    const topLevelComments: any[] = [];

    for (const comment of comments) {
      const mapped = {
        id_comment: comment.id_comment,
        text: comment.text,
        isParent: !comment.parent,
        user: comment.user
          ? { id_user: comment.user.id_user, username: comment.user.username }
          : null,
        replies: [],
      };

      if (comment.parent) {
        const parentReplies = commentMap.get(comment.parent.id_comment) || [];
        parentReplies.push(mapped);
        commentMap.set(comment.parent.id_comment, parentReplies);
      } else {
        topLevelComments.push(mapped);
      }
    }

    const attachReplies = (commentNode: any) => {
      const replies = commentMap.get(commentNode.id_comment) || [];
      commentNode.replies = replies.map(attachReplies);
      return commentNode;
    };

    return topLevelComments.map(attachReplies);
  }
}
