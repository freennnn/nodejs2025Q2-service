import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      // Special handling for validation errors on /auth/refresh endpoint
      if (
        exception instanceof BadRequestException &&
        request.url === '/auth/refresh' &&
        request.method === 'POST'
      ) {
        const exceptionResponse = exception.getResponse() as any;

        // Check if it's a validation error for refreshToken
        if (
          exceptionResponse?.message &&
          Array.isArray(exceptionResponse.message) &&
          exceptionResponse.message.some(
            (msg: string) =>
              msg.includes('refreshToken') ||
              msg.includes('should not be empty'),
          )
        ) {
          // Convert to 401 Unauthorized for missing refresh token
          status = HttpStatus.UNAUTHORIZED;
          message = 'Refresh token is required';
          error = 'Unauthorized';
        } else {
          // Regular BadRequest handling
          status = exception.getStatus();
          const exceptionResponse = exception.getResponse() as any;

          if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            error = exception.name;
          } else {
            message = exceptionResponse.message || exception.message;
            error = exceptionResponse.error || exception.name;
          }
        }
      } else {
        // Handle other HTTP exceptions normally
        status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;

        if (typeof exceptionResponse === 'string') {
          message = exceptionResponse;
          error = exception.name;
        } else {
          message = exceptionResponse.message || exception.message;
          error = exceptionResponse.error || exception.name;
        }
      }
    } else {
      // Handle unexpected errors - always return 500
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      error = 'Internal Server Error';

      // Log the actual error for debugging
      if (exception instanceof Error) {
        this.loggingService.logException(exception, 'UnexpectedError');
      } else {
        this.loggingService.error(
          'Unknown exception occurred',
          'UnexpectedError',
          { exception },
        );
      }
    }

    // Log all errors
    this.loggingService.error(`HTTP ${status} Error`, 'ExceptionFilter', {
      method: request.method,
      url: request.url,
      statusCode: status,
      error: error,
      message: message,
      userAgent: request.get('User-Agent'),
      ip: request.ip,
    });

    // Send standardized error response
    const errorResponse = {
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
