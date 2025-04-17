import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '4000', 10);
  app.enableCors();
  await app.listen(port);
  Logger.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
