import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
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
      // Handle HTTP exceptions normally
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        message = exceptionResponse.message || exception.message;
        error = exceptionResponse.error || exception.name;
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
