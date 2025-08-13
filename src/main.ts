import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
async function bootstrap() {
  const appUrl = process.env.SANTA_APPLICATION_URL || 'http://localhost:3002';
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: [appUrl], // frontend origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // if sending cookies or authorization headers
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
