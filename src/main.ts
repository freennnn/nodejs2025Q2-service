import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Load the appropriate .env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

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

  // Setup Swagger UI with existing api.yaml
  try {
    const apiYamlPath = path.join(__dirname, '..', 'doc', 'api.yaml');
    const apiYaml = fs.readFileSync(apiYamlPath, 'utf8');
    const apiDocument = yaml.load(apiYaml) as any;

    SwaggerModule.setup('doc', app, apiDocument);
    console.log('Swagger UI available at http://localhost:4000/doc');
  } catch (error) {
    console.warn('Could not load api.yaml for Swagger UI:', error.message);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Application is running on port ${port}`);
}
bootstrap();
