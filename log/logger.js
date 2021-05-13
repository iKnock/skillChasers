const winston = require('winston');
const fs = require('fs');
const path = require('path');

// create log file if not exist
//__dirname is the current directory
const logDirectory = path.join(__dirname, process.env.LOG_DIR_NAME);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// app loger config
const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: process.env.LOG_FILE_NAME,
            dirname: logDirectory,
            handleExceptions: true,
            json: true,
            maxsize: process.env.LOG_MAX_SIZE,
            maxFiles: process.env.LOG_MAX_FILE,
            colorize: false,
        }),
        new winston.transports.Console({
            name: 'error',
            level: 'error',
            handleExceptions: true,
            json: true,
            colorize: true,
        }),
        new winston.transports.Console({
            name: 'debug',
            level: 'debug',
            handleExceptions: true,
            json: true,
            colorize: true,
        }),
    ],
    exitOnError: false,
});

module.exports = Logger;