/**
 * Production-Safe Logger Utility
 * 
 * Replaces console.log with environment-aware logging.
 * 
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('User logged in', { userId: 123 });
 *   logger.error('Payment failed', error);
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_DEBUG = process.env.DEBUG === 'true' || process.env.DEBUG === '1';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (context && Object.keys(context).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(context)}`;
  }
  
  return `${prefix} ${message}`;
}

/**
 * Info-level logging — suppressed in production unless DEBUG=true
 */
function info(message: string, context?: LogContext): void {
  if (IS_PRODUCTION && !IS_DEBUG) return;
  
  const formatted = formatMessage('info', message, context);
  console.log(formatted);
}

/**
 * Warning-level logging — always logged (even in production)
 */
function warn(message: string, context?: LogContext): void {
  const formatted = formatMessage('warn', message, context);
  console.warn(formatted);
}

/**
 * Error-level logging — always logged (even in production)
 */
function error(message: string, err?: Error | unknown, context?: LogContext): void {
  const formatted = formatMessage('error', message, context);
  
  if (err instanceof Error) {
    console.error(formatted, err);
  } else if (err) {
    console.error(formatted, err);
  } else {
    console.error(formatted);
  }
}

/**
 * Debug-level logging — only when DEBUG=true
 */
function debug(message: string, context?: LogContext): void {
  if (!IS_DEBUG) return;
  
  const formatted = formatMessage('debug', message, context);
  console.log(formatted);
}

export const logger = {
  info,
  warn,
  error,
  debug,
};
