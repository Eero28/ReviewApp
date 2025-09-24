import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  Logger,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { GlobalResponseInterceptor } from './Interceptors/Interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = parseInt(process.env.PORT || '4000', 10);
  app.enableCors();
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new GlobalResponseInterceptor(),
  );

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
