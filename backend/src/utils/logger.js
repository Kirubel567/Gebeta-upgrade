


const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
};


const LOG_LEVELS = {
    DEBUG: { priority: 0, color: colors.gray, label: 'DEBUG' },
    INFO: { priority: 1, color: colors.cyan, label: 'INFO ' },
    WARN: { priority: 2, color: colors.yellow, label: 'WARN ' },
    ERROR: { priority: 3, color: colors.red, label: 'ERROR' },
    FATAL: { priority: 4, color: colors.magenta, label: 'FATAL' },
};


const currentLogLevel = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
const currentPriority = LOG_LEVELS[currentLogLevel]?.priority ?? 1;

const isProduction = process.env.NODE_ENV === 'production';


const getTimestamp = () => {
    const now = new Date();
    return now.toISOString();
};

// Format log message with metadata
const formatLogMessage = (level, message, meta = {}) => {
    return {
        timestamp: getTimestamp(),
        level: level.toUpperCase(),
        message,
        ...(Object.keys(meta).length > 0 && { meta }),
        ...(process.env.NODE_ENV && { env: process.env.NODE_ENV }),
    };
};

// Format log for console output with colors

const formatConsoleOutput = (level, message, meta = {}) => {
    const levelConfig = LOG_LEVELS[level.toUpperCase()];
    const timestamp = getTimestamp();

    const coloredLevel = `${levelConfig.color}${colors.bright}[${levelConfig.label}]${colors.reset}`;
    const coloredTimestamp = `${colors.gray}${timestamp}${colors.reset}`;
    const coloredMessage = `${levelConfig.color}${message}${colors.reset}`;

    let output = `${coloredTimestamp} ${coloredLevel} ${coloredMessage}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
        const metaString = JSON.stringify(meta, null, 2);
        output += `\n${colors.dim}${metaString}${colors.reset}`;
    }

    return output;
};

// Core logging function

const log = (level, message, meta = {}) => {
    const levelConfig = LOG_LEVELS[level.toUpperCase()];

    // Skip if log level is below current threshold
    if (!levelConfig || levelConfig.priority < currentPriority) {
        return;
    }

    if (isProduction) {
        // Production: JSON structured logs (for log aggregation tools)
        const logObject = formatLogMessage(level, message, meta);
        console.log(JSON.stringify(logObject));
    } else {
        // Development: Colored, human-readable logs
        const output = formatConsoleOutput(level, message, meta);

        // Use appropriate console method
        if (level === 'ERROR' || level === 'FATAL') {
            console.error(output);
        } else if (level === 'WARN') {
            console.warn(output);
        } else {
            console.log(output);
        }
    }
};

// Logger class with convenience methods

class Logger {
   
    debug(message, meta = {}) {
        log('DEBUG', message, meta);
    }

    
    info(message, meta = {}) {
        log('INFO', message, meta);
    }

    
    warn(message, meta = {}) {
        log('WARN', message, meta);
    }

    
     
    error(message, error = {}) {
        const meta = error instanceof Error
            ? {
                error: error.message,
                stack: error.stack,
                ...(error.code && { code: error.code }),
            }
            : error;

        log('ERROR', message, meta);
    }

    
    fatal(message, error = {}) {
        const meta = error instanceof Error
            ? {
                error: error.message,
                stack: error.stack,
                ...(error.code && { code: error.code }),
            }
            : error;

        log('FATAL', message, meta);
    }

    // logging request
    request(req, additionalMeta = {}) {
        const meta = {
            method: req.method,
            url: req.url,
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            ...additionalMeta,
        };

        this.info(`${req.method} ${req.url}`, meta);
    }

    // logging response
    response(req, statusCode, responseTime) {
        const level = statusCode >= 500 ? 'ERROR' : statusCode >= 400 ? 'WARN' : 'INFO';

        const meta = {
            method: req.method,
            url: req.url,
            statusCode,
            ...(responseTime && { responseTime: `${responseTime}ms` }),
        };

        log(level, `${req.method} ${req.url} - ${statusCode}`, meta);
    }

    // db operation
    db(operation, collection, meta = {}) {
        this.debug(`DB ${operation}: ${collection}`, meta);
    }
}

// Export singleton instance
export default new Logger();
