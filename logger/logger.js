const fs = require('fs');
const path = require('path');

const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const apiFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// create log file if not exist
const logDirectory = path.join(__dirname, process.env.LOG_DIR_NAME);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// app loger config
const Logger = createLogger({
    defaultMeta: { service: 'skill-chasers-service' },
    format: combine(
        label({ label: 'Skill Chasers' }),
        timestamp(),
        apiFormat
    ),
    exitOnError: false,
});

const file = new transports.File({
    level: 'info',
    filename: process.env.LOG_FILE_NAME,
    dirname: logDirectory,
    handleExceptions: true,
    json: false,
    maxsize: process.env.LOG_MAX_SIZE,
    maxFiles: process.env.LOG_MAX_FILE,
    colorize: false,
})

const console = new transports.Console({
    name: 'info',
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
})

const consoleDebug = new transports.Console({
    name: 'debug',
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
})

Logger.add(file);
Logger.add(console);

Logger.stream = {
    write: function (message, encoding) {
        Logger.info(message, encoding);
    },
};

module.exports = Logger;