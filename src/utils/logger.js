const fs = require('fs');
const path = require('path');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = levels[process.env.LOG_LEVEL || 'info'];

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  });
};

const logger = {
  error: (message, data) => {
    if (currentLevel >= levels.error) {
      console.error(formatLog('ERROR', message, data));
    }
  },
  warn: (message, data) => {
    if (currentLevel >= levels.warn) {
      console.warn(formatLog('WARN', message, data));
    }
  },
  info: (message, data) => {
    if (currentLevel >= levels.info) {
      console.log(formatLog('INFO', message, data));
    }
  },
  debug: (message, data) => {
    if (currentLevel >= levels.debug) {
      console.debug(formatLog('DEBUG', message, data));
    }
  },
};

module.exports = logger;