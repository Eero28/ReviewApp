import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  // Create top-level comment
  @Post()
  async createComment(@Body() create: CreateCommentDto): Promise<Comment> {
    return await this.commentService.createComment(create);
  }

  // Create reply to an existing comment
  @Post('reply/:parentCommentId')
  async createReply(
    @Param('parentCommentId') parentCommentId: number,
    @Body() create: CreateCommentDto,
  ): Promise<Comment> {
    return await this.commentService.createComment({
      ...create,
      parentCommentId,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id_comment: number): Promise<Comment> {
    return await this.commentService.findOne(id_comment);
  }

  @Get('review/:id_review')
  async getReviewComments(@Param('id_review') id_review: number) {
    return await this.commentService.findReviewComments(id_review);
  }

  @Get('reply/:id_comment')
  async findCommentsReplies(@Param('id_comment') id_comment: number) {
    return await this.commentService.findCommentsReplies(id_comment);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('id') id: number,
    @Request() request,
  ): Promise<void> {
    return await this.commentService.deleteComment(id, request);
  }

  @Get()
  async findAll(): Promise<Comment[]> {
    return await this.commentService.findAll();
  }
}
