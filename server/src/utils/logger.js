/**
 * Logger utility for consistent logging across the application
 * Provides different log levels and formatting for better debugging
 */

// Log levels with color codes for console output
const LOG_LEVELS = {
  ERROR: { level: 0, color: '\x1b[31m', prefix: 'ERROR' }, // Red
  WARN: { level: 1, color: '\x1b[33m', prefix: 'WARN' },   // Yellow
  INFO: { level: 2, color: '\x1b[36m', prefix: 'INFO' },   // Cyan
  DEBUG: { level: 3, color: '\x1b[32m', prefix: 'DEBUG' }, // Green
  TRACE: { level: 4, color: '\x1b[35m', prefix: 'TRACE' }  // Magenta
};

// Reset color code
const RESET_COLOR = '\x1b[0m';

// Current log level (can be set via environment variable)
let currentLogLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toUpperCase() : 'INFO';
if (!LOG_LEVELS[currentLogLevel]) {
  currentLogLevel = 'INFO';
}

/**
 * Format a log message with timestamp, level, and module information
 * @param {string} level - Log level
 * @param {string} module - Source module name
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 * @returns {string} Formatted log message
 */
const formatLogMessage = (level, module, message, data) => {
  const timestamp = new Date().toISOString();
  const logConfig = LOG_LEVELS[level];
  
  let formattedMessage = `${timestamp} ${logConfig.color}[${logConfig.prefix}]${RESET_COLOR} [${module}] ${message}`;
  
  if (data) {
    try {
      if (typeof data === 'object') {
        formattedMessage += `\n${JSON.stringify(data, null, 2)}`;
      } else {
        formattedMessage += ` ${data}`;
      }
    } catch (error) {
      formattedMessage += ` [Error serializing data: ${error.message}]`;
    }
  }
  
  return formattedMessage;
};

/**
 * Log a message if the current log level permits
 * @param {string} level - Log level
 * @param {string} module - Source module name
 * @param {string} message - Log message
 * @param {Object} data - Additional data to log
 */
const log = (level, module, message, data) => {
  if (LOG_LEVELS[level].level <= LOG_LEVELS[currentLogLevel].level) {
    const formattedMessage = formatLogMessage(level, module, message, data);
    
    if (level === 'ERROR') {
      console.error(formattedMessage);
    } else if (level === 'WARN') {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }
  }
};

/**
 * Create a logger instance for a specific module
 * @param {string} moduleName - Name of the module using this logger
 * @returns {Object} Logger object with methods for different log levels
 */
const createLogger = (moduleName) => {
  return {
    error: (message, data) => log('ERROR', moduleName, message, data),
    warn: (message, data) => log('WARN', moduleName, message, data),
    info: (message, data) => log('INFO', moduleName, message, data),
    debug: (message, data) => log('DEBUG', moduleName, message, data),
    trace: (message, data) => log('TRACE', moduleName, message, data)
  };
};

/**
 * Set the current log level
 * @param {string} level - New log level
 */
const setLogLevel = (level) => {
  const upperLevel = level.toUpperCase();
  if (LOG_LEVELS[upperLevel]) {
    currentLogLevel = upperLevel;
    const logger = createLogger('Logger');
    logger.info(`Log level set to ${currentLogLevel}`);
  } else {
    const logger = createLogger('Logger');
    logger.error(`Invalid log level: ${level}. Using default: ${currentLogLevel}`);
  }
};

export default {
  createLogger,
  setLogLevel
};
