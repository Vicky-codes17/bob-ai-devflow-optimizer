// utils/logger.js - Simple Logging Utility

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
  SUCCESS: 'SUCCESS'
};

/**
 * Color codes for console output
 */
const colors = {
  INFO: '\x1b[36m',    // Cyan
  WARN: '\x1b[33m',    // Yellow
  ERROR: '\x1b[31m',   // Red
  DEBUG: '\x1b[35m',   // Magenta
  SUCCESS: '\x1b[32m', // Green
  RESET: '\x1b[0m'
};

/**
 * Format timestamp
 */
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Log message with level
 */
function log(level, message, data = null) {
  const timestamp = getTimestamp();
  const color = colors[level] || colors.RESET;
  const reset = colors.RESET;
  
  let logMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`;
  
  console.log(logMessage);
  
  if (data) {
    console.log(data);
  }
}

/**
 * Info log
 */
function info(message, data = null) {
  log(LogLevel.INFO, message, data);
}

/**
 * Warning log
 */
function warn(message, data = null) {
  log(LogLevel.WARN, message, data);
}

/**
 * Error log
 */
function error(message, data = null) {
  log(LogLevel.ERROR, message, data);
}

/**
 * Debug log (only in development)
 */
function debug(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    log(LogLevel.DEBUG, message, data);
  }
}

/**
 * Success log
 */
function success(message, data = null) {
  log(LogLevel.SUCCESS, message, data);
}

/**
 * Log HTTP request
 */
function logRequest(req) {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  info(`${method} ${url} - ${ip}`);
}

/**
 * Log HTTP response
 */
function logResponse(req, res, duration) {
  const method = req.method;
  const url = req.originalUrl || req.url;
  const status = res.statusCode;
  const statusColor = status >= 500 ? colors.ERROR : 
                      status >= 400 ? colors.WARN : 
                      colors.SUCCESS;
  
  console.log(
    `${statusColor}${method} ${url} - ${status}${colors.RESET} - ${duration}ms`
  );
}

/**
 * Log database query
 */
function logQuery(query, params = []) {
  if (process.env.NODE_ENV === 'development') {
    debug('Database Query:', { query, params });
  }
}

/**
 * Log API call
 */
function logApiCall(service, endpoint, status) {
  info(`API Call: ${service} - ${endpoint} - Status: ${status}`);
}

module.exports = {
  LogLevel,
  info,
  warn,
  error,
  debug,
  success,
  logRequest,
  logResponse,
  logQuery,
  logApiCall
};

// Made with Bob