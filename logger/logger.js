import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

import winston from 'winston';
const { createLogger, format, transports } = winston;

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { logDirName } from '../config/keys.mjs';
const { combine, timestamp, label, printf } = format;

const apiFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// create log file if not exist
//const logDirectory = path.join(__dirname, process.env.LOG_DIR_NAME);
const logDirectory = join(__dirname, logDirName);
if (!existsSync(logDirectory)) {
    mkdirSync(logDirectory);
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

export default Logger;