import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import {User} from '../users/entities/user.entity'
import {Comment} from '../comments/entities/comment.entity'
@Module({
  imports: [TypeOrmModule.forFeature([Reply, Comment, User])],
  providers: [ReplyService],
  controllers: [ReplyController]
})
export class ReplyModule {}
