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

    let parentComment: Comment = null;
    if (dto.parentCommentId) {
      parentComment = await this.commentRepository.findOne({
        where: { id_comment: dto.parentCommentId },
        relations: ['review'],
      });
      if (!parentComment) {
        throw new NotFoundException(`Parent comment not found`);
      }
      if (parentComment.review.id_review !== dto.id_review) {
        throw new ForbiddenException(
          'Parent comment must belong to the same review',
        );
      }
    }

    const newComment = this.commentRepository.create({
      text: dto.text,
      review,
      user,
      parent: parentComment,
    });

    return this.commentRepository.save(newComment);
  }

  private buildCommentTree(comments: Comment[], rootCommentId?: number) {
    const commentRepliesMap = new Map<number, any[]>();
    const topLevelComments: any[] = [];

    for (const commentEntity of comments) {
      const mappedComment = {
        id_comment: commentEntity.id_comment,
        createdAt: commentEntity.createdAt,
        text: commentEntity.text,
        isParent: !commentEntity.parent,
        user: commentEntity.user
          ? {
              id_user: commentEntity.user.id_user,
              username: commentEntity.user.username,
            }
          : null,
        replies: [],
      };

      if (commentEntity.parent) {
        const existingReplies =
          commentRepliesMap.get(commentEntity.parent.id_comment) || [];
        existingReplies.push(mappedComment);
        commentRepliesMap.set(commentEntity.parent.id_comment, existingReplies);
      } else {
        topLevelComments.push(mappedComment);
      }
    }

    const attachRepliesRecursively = (mappedCommentNode: any) => {
      const replies = commentRepliesMap.get(mappedCommentNode.id_comment) || [];
      mappedCommentNode.replies = replies.map(attachRepliesRecursively);
      return mappedCommentNode;
    };

    if (rootCommentId) {
      const rootCommentEntity = comments.find(
        (entity) => entity.id_comment === rootCommentId,
      );
      if (!rootCommentEntity) return [];
      const mappedRootComment = {
        id_comment: rootCommentEntity.id_comment,
        text: rootCommentEntity.text,
        isParent: !rootCommentEntity.parent,
        user: rootCommentEntity.user
          ? {
              id_user: rootCommentEntity.user.id_user,
              username: rootCommentEntity.user.username,
            }
          : null,
        replies: [],
      };
      return [attachRepliesRecursively(mappedRootComment)];
    }

    return topLevelComments.map(attachRepliesRecursively);
  }

  async findReviewComments(reviewId: number) {
    const comments = await this.commentRepository.find({
      where: { review: { id_review: reviewId } },
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });
    return this.buildCommentTree(comments);
  }

  async findCommentsReplies(commentId: number) {
    const comments = await this.commentRepository.find({
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });
    return this.buildCommentTree(comments, commentId);
  }

  async findAll() {
    const comments = await this.commentRepository.find({
      relations: ['user', 'parent'],
      order: { createdAt: 'ASC' },
    });

    // If all comments have parent, pick any root candidates
    return this.buildCommentTree(comments.filter((c) => !c.parent));
  }

  async deleteComment(
    commentId: number,
    request: { user: User },
  ): Promise<void> {
    const commentEntity = await this.commentRepository.findOne({
      where: { id_comment: commentId },
      relations: ['user'],
    });

    if (!commentEntity) {
      throw new NotFoundException(`Comment not found`);
    }

    if (commentEntity.user.id_user !== request.user.id_user) {
      throw new ForbiddenException('Cannot delete others comments');
    }

    await this.commentRepository.remove(commentEntity);
  }

  async findOne(commentId: number): Promise<Comment> {
    const commentEntity = await this.commentRepository.findOne({
      where: { id_comment: commentId },
      relations: ['user', 'parent'],
    });
    if (!commentEntity) {
      throw new NotFoundException(`Comment not found`);
    }
    return commentEntity;
  }
}
