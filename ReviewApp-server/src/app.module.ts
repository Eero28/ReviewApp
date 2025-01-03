import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {GlobalResponseInterceptor} from '../Error/Interceptor'
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReplyModule } from './reply/reply.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    ReviewModule,
    CommentsModule,
    LikeModule,
    ReplyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
  ],
})
export class AppModule {}
