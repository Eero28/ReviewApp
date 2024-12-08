import { Controller, Post, Param, Body, Get, Delete } from '@nestjs/common';
import { LikeService } from './like.service';
import { Review } from 'src/review/entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('like/review/:id_review')
  async likeReview(
    @Param('id_review') id_review: number,
    @Body('id_user') id_user: number
  ): Promise<Review> {
    console.log('like')
    return this.likeService.likeReview(id_user, id_review);
  }

  @Delete('unlike/review/:id_review/user/:id_user')
  async deleteLike(
    @Param('id_review') id_review:number,
    @Param('id_user') id_user: number
  ){
    console.log("unlike")
    return this.likeService.deleteLike(id_user,id_review)
  }

  @Get(':id_like')
  async findOne(@Param('id_like') id_like: number){
    return this.likeService.findOne(id_like)
  }

  @Get('users/review/:id_review')
  async getUsersWhoLikedReview(@Param('id_review') id_review: number): Promise<User[]> {
    return this.likeService.getUsersWhoLikedReview(id_review);
  }
}
