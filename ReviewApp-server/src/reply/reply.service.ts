import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reply } from './entities/reply.entity';
import { CreateReplyDto } from './dto/create-reply.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createReply(createReplyDto: CreateReplyDto): Promise<Reply> {
    const { text, id_comment, id_user } = createReplyDto;

    console.log(createReplyDto)

  
    const comment = await this.commentRepository.findOne({ where: { id_comment } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

 
    const reply = this.replyRepository.create({
      text,    
      comment, 
      user,    
    });

    // Save and return the created reply
    return await this.replyRepository.save(reply);
  }

  async getRepliesByComment(id_comment: number): Promise<Reply[]> {
    return this.replyRepository.find({
      where: { comment: { id_comment } },
      relations: ['user', 'comment'],
    });
  }


  async getAllReplies(): Promise<Reply[]> {
    return this.replyRepository.find({
      relations: ['user', 'comment'], 
    });
  }
}
