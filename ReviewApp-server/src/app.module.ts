import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, ReviewModule, CommentsModule, LikeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
