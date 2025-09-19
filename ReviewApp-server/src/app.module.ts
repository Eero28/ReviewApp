import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './review/review.module';
import { CommentsModule } from './comments/comments.module';
import { LikeModule } from './like/like.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TensorflowModule } from './tensorflow/tensorflow.module';
import { LoggerMiddleware } from './logger/middleware';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    ReviewModule,
    CommentsModule,
    LikeModule,
    TensorflowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
//apply logger for all routes
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
