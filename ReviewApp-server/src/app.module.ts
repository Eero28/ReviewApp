import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReplyModule } from './reply/reply.module';
import { TensorflowModule } from './tensorflow/tensorflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    ReviewModule,
    CommentsModule,
    LikeModule,
    ReplyModule,
    TensorflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
