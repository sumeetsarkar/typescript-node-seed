import winston from 'winston';
import { transports, format } from 'winston';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import momentTimezone from 'moment-timezone';

export const LOG_FILE_OUT = 'stdout.log';
export const LOG_FILE_ERR = 'stderr.log';

const { combine, label, prettyPrint, colorize, printf } = format;
const { Console, File } = transports;

// Formatting ----------------------------------------------------------
const appendTimestamp = format((info, opts) => {
  if (opts.tz) {
    info.timestamp = momentTimezone().tz(opts.tz).format();
  }
  return info;
});

const logFormat = printf(info =>
  `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`);

const formatOptions = combine(
  label({ label: 'NTS' }),
  appendTimestamp({ tz: 'Asia/Kolkata' }),
  logFormat
);

const formatOptionsConsole = combine(
  colorize(),
  prettyPrint(),
  label({ label: 'NTS' }),
  appendTimestamp({ tz: 'Asia/Kolkata' }),
  logFormat
);

// Initialize Transports ---------------------------------------------
const transportConsole = new Console({
  format: formatOptionsConsole,
});

const transportFileStdout = new File({
  filename: LOG_FILE_OUT,
  tailable: true,
  handleExceptions: true,
});

const transportFileStderr = new File({
  filename: LOG_FILE_ERR,
  level: 'error',
  tailable: true,
  handleExceptions: true,
});

const transportDailyRotateFile = new winstonDailyRotateFile({
  json: true,
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '100m',
  maxFiles: '30d',
  dirname: 'logs',
});

transportDailyRotateFile.on('rotate', (oldFilename, newFilename) => {
  // notify log rotation
});

// Intialize Logger ---------------------------------------------
const logger = winston.createLogger({
  format: formatOptions,
  transports: [
    transportConsole,
    transportFileStdout,
    transportFileStderr,
    transportDailyRotateFile,
  ],
});

export const loggerStream = {
  write: (message: string) => {
    logger.info(message);
  },
};

export default logger;
