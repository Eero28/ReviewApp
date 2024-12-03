import { Controller, Post, Body, Get, Param, Query, Delete, Request, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) { }

    @Post()
    async create(@Body() create: CreateCommentDto): Promise<Comment> {
        console.log(create);
        return await this.commentService.create(create)
    }

    @Get(":id")
    async findOne(@Param("id") id_comment: number): Promise<Comment> {
        return await this.commentService.findOne(id_comment)
    }

    @Get('review/:id_review')
    async getReviewComments(
        @Param('id_review') id_review: number,
    ) {
        return await this.commentService.findReviewComments(id_review)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number, @Request() req): Promise<void> {
        return await this.commentService.deleteComment(id,req)
    }

    @Get()
    async findAll(): Promise<Comment[]> {
        return await this.commentService.findAll()
    }


}


