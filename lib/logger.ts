// lib/logger.ts
import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Custom console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(
    ({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}] : ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata);
      }
      return msg;
    }
  )
);

// Create base logger instance
const baseLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: logFormat,
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    // new DailyRotateFile({
    //   filename: path.join(process.cwd(), 'logs', 'app-error-%DATE%.log'),
    //   datePattern: 'YYYY-MM-DD',
    //   level: 'error',
    //   maxSize: '5m',
    //   maxFiles: '10d',
    //   format: logFormat
    // }),
    
    // Write all logs with importance level of 'debug' or less to daily log file
    new DailyRotateFile({
      filename: path.join(process.cwd(), 'logs', 'app-log-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'debug',
      maxSize: '5m',
      maxFiles: '10d',
      format: logFormat
    })
  ],
  // exceptionHandlers: [
  //   new DailyRotateFile({
  //     filename: path.join(process.cwd(), 'logs', 'app-exceptions-%DATE%.log'),
  //     datePattern: 'YYYY-MM-DD',
  //     maxSize: '5m',
  //     maxFiles: '10d',
  //     format: logFormat
  //   })
  // ]
});

// Add console transport for development environment
if (process.env.NODE_ENV !== 'production') {
  baseLogger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Create a server-side safe logger
const logger = {
  error: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.error(message, meta);
    }
  },
  warn: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.warn(message, meta);
    }
  },
  info: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.info(message, meta);
    }
  },
  http: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.http(message, meta);
    }
  },
  verbose: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.verbose(message, meta);
    }
  },
  debug: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.debug(message, meta);
    }
  },
  silly: (message: string, meta?: any) => {
    if (typeof window === 'undefined') {
      baseLogger.silly(message, meta);
    }
  }
};

export default logger;