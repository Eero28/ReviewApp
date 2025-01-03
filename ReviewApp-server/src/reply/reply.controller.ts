import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { Reply } from './entities/reply.entity';
import { CreateReplyDto } from './dto/create-reply.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  async createReply(@Body() createReplyDto: CreateReplyDto): Promise<Reply> {
    return this.replyService.createReply(createReplyDto);
  }

  
  @Get()
  async getAllReplies(): Promise<Reply[]> {
    return this.replyService.getAllReplies();
  }

  @Get('comment/:id_comment')
  async getRepliesByComment(@Param('id_comment') id_comment: number): Promise<Reply[]> {
    return this.replyService.getRepliesByComment(id_comment);
  }
}
