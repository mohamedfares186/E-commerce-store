import winston from "winston";

const { createLogger, format, transports } = winston;

const jsonFormat = format.combine(format.timestamp(), format.json());

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    // Console transport for all logs
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
    // File transport for errors only
    new transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/warn.log",
      level: "warn",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: jsonFormat,
    }),
    new transports.File({
      filename: "logs/info.log",
      level: "info",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: jsonFormat,
    }),
  ],
});

const requestLogger = (req, res, next) => {
  const { method, url, hostname, ip, headers, message } = req;
  const time = new Date().toISOString();
  const startTime = Date.now();

  // Log request
  logger.info(`${method} request - ${url} | ${ip}`);

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const logData = {
      time: time,
      message: message,
      url: url,
      method: method,
      statusCode: statusCode,
      hostname: hostname,
      duration: duration,
      ip: ip,
      headers: headers,
    };

    if (statusCode >= 500) {
      logger.error(logData);
    } else if (statusCode >= 400) {
      // Differentiate security-related warnings more clearly
      if (statusCode === 401 || statusCode === 403) {
        logData.message = `[SECURITY] Unauthorized/Forbidden Access`;
        logger.warn(logData);
      } else {
        logData.message = `Client Error`;
        logger.warn(logData);
      }
    } else {
      logger.info(logData);
    }
  });

  next();
};

export { logger, requestLogger };
