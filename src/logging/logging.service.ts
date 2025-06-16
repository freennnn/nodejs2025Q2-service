import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  meta?: any;
}

@Injectable()
export class LoggingService {
  private readonly logLevel: LogLevel;
  private readonly logDir: string;
  private readonly maxFileSize: number; // in KB
  private readonly logFileName: string;
  private readonly errorFileName: string;

  constructor() {
    this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL || 'INFO');
    this.logDir = process.env.LOG_DIR || './logs';
    this.maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE || '1024'); // 1MB default
    this.logFileName = 'app.log';
    this.errorFileName = 'error.log';

    this.ensureLogDirectory();
  }

  private parseLogLevel(level: string): LogLevel {
    const upperLevel = level.toUpperCase();
    switch (upperLevel) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatLogEntry(
    level: string,
    message: string,
    context?: string,
    meta?: any,
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context,
      meta,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private writeToFile(filename: string, logEntry: LogEntry): void {
    const filePath = path.join(this.logDir, filename);
    const logLine = this.formatLogLine(logEntry);

    // Check if file needs rotation
    this.rotateFileIfNeeded(filePath);

    // Append to file
    fs.appendFileSync(filePath, logLine + '\n', 'utf8');
  }

  private formatLogLine(logEntry: LogEntry): string {
    const { timestamp, level, message, context, meta } = logEntry;
    let logLine = `[${timestamp}] [${level}]`;

    if (context) {
      logLine += ` [${context}]`;
    }

    logLine += ` ${message}`;

    if (meta) {
      logLine += ` ${JSON.stringify(meta)}`;
    }

    return logLine;
  }

  private rotateFileIfNeeded(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      return;
    }

    const stats = fs.statSync(filePath);
    const fileSizeKB = stats.size / 1024;

    if (fileSizeKB >= this.maxFileSize) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const rotatedFileName = `${filePath}.${timestamp}`;
      fs.renameSync(filePath, rotatedFileName);
    }
  }

  private logToConsoleAndFile(
    level: LogLevel,
    levelName: string,
    message: string,
    context?: string,
    meta?: any,
  ): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const logEntry = this.formatLogEntry(levelName, message, context, meta);
    const logLine = this.formatLogLine(logEntry);

    // Console output
    process.stdout.write(logLine + '\n');

    // File output
    this.writeToFile(this.logFileName, logEntry);

    // Error logs also go to error file
    if (level === LogLevel.ERROR) {
      this.writeToFile(this.errorFileName, logEntry);
    }
  }

  error(message: string, context?: string, meta?: any): void {
    this.logToConsoleAndFile(LogLevel.ERROR, 'ERROR', message, context, meta);
  }

  warn(message: string, context?: string, meta?: any): void {
    this.logToConsoleAndFile(LogLevel.WARN, 'WARN', message, context, meta);
  }

  info(message: string, context?: string, meta?: any): void {
    this.logToConsoleAndFile(LogLevel.INFO, 'INFO', message, context, meta);
  }

  debug(message: string, context?: string, meta?: any): void {
    this.logToConsoleAndFile(LogLevel.DEBUG, 'DEBUG', message, context, meta);
  }

  // Special method for request logging
  logRequest(
    method: string,
    url: string,
    query: any,
    body: any,
    userAgent?: string,
  ): void {
    const meta = {
      method,
      url,
      query,
      body,
      userAgent,
    };

    this.info('Incoming request', 'HTTP', meta);
  }

  // Special method for response logging
  logResponse(
    method: string,
    url: string,
    statusCode: number,
    responseTime?: number,
  ): void {
    const meta = {
      method,
      url,
      statusCode,
      responseTime: responseTime ? `${responseTime}ms` : undefined,
    };

    const level = statusCode >= 400 ? 'ERROR' : 'INFO';
    const message = `Response ${statusCode}`;

    if (level === 'ERROR') {
      this.error(message, 'HTTP', meta);
    } else {
      this.info(message, 'HTTP', meta);
    }
  }

  // Method for logging exceptions
  logException(error: Error, context?: string): void {
    const meta = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };

    this.error(`Exception occurred: ${error.message}`, context, meta);
  }
}
