import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingService } from './logging/logging.service';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
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

  // Get logging service instance
  const loggingService = app.get(LoggingService);

  // Setup global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(loggingService));

  // Setup global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));

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
    loggingService.info(
      'Swagger UI available at http://localhost:4000/doc',
      'Bootstrap',
    );
  } catch (error) {
    loggingService.warn('Could not load api.yaml for Swagger UI', 'Bootstrap', {
      error: error.message,
    });
  }

  // Setup process-level error handlers
  setupProcessErrorHandlers(loggingService);

  const port = process.env.PORT || 4000;
  await app.listen(port);

  loggingService.info(`🚀 Application is running on port ${port}`, 'Bootstrap');
  loggingService.info(`Environment: ${process.env.NODE_ENV}`, 'Bootstrap');
  loggingService.info(
    `Log Level: ${process.env.LOG_LEVEL || 'INFO'}`,
    'Bootstrap',
  );
}

function setupProcessErrorHandlers(loggingService: LoggingService): void {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      'Uncaught Exception - Application will exit',
      'Process',
      {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    );

    // Give time for logs to flush, then exit
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    loggingService.error('Unhandled Promise Rejection', 'Process', {
      reason: reason?.toString() || 'Unknown reason',
      stack: reason?.stack || 'No stack trace available',
      promise: promise.toString(),
    });

    // Log but don't exit for unhandled rejections (let the application continue)
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    loggingService.info(
      'SIGTERM received, shutting down gracefully',
      'Process',
    );
  });

  process.on('SIGINT', () => {
    loggingService.info('SIGINT received, shutting down gracefully', 'Process');
  });
}

bootstrap();
