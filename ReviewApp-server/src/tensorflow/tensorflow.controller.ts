import { Controller, Get, Param } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';

@Controller('tensorflow')
export class TensorflowController {
  constructor(private readonly tensorflowService: TensorflowService) {}

  // Endpoint to get the top 5 interesting reviews for a user
  @Get('recommendations/:id_user')
  async getRecommendations(@Param('id_user') id_user: number) {
    const convertIdUser = Number(id_user);
    const recommendations =
      await this.tensorflowService.recommendInterestingReviews(convertIdUser);
    return recommendations;
  }
}
