import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    // Incoming Request → ValidationPipe → DTO Validation → Controller Method:
    // 1. NestJS extracts the request body/params
    // 2. ValidationPipe attempts to transform the plain object into DTO class instance
    // 3. It runs all validation decorators on the DTO
    // 4. If validation passes, the controller method receives the validated DTO
    // 5. If validation fails, it automatically throws a BadRequestException (400 status)
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators,  prevents unwanted data from reaching handlers
      forbidNonWhitelisted: true, // Throw error if unknown properties exist
      transform: true, //Transform plain objects to DTO instances
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
