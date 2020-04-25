import config from 'config';
import path from 'path';
import winston from 'winston';

export default class Logger {
	logFileName = path.join(__dirname, '../../', 'logs/talktodoc_backend.app.log');
	errorLogFileName = path.join(__dirname, '../../', 'logs/talktodoc_backend.error.log');
	logger = null;

	async init() {
		try {
			this.logger = await winston.createLogger({
				format: winston.format.json(),
				exceptionHandlers: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: this.errorLogFileName,
						level: 'error',
						maxSize: config.logger.maxSize,
						maxFiles: config.logger.maxFiles
					})
				],

				transports: [
					new winston.transports.Console(),
					new winston.transports.File({
						filename: this.logFileName,
						maxSize: config.logger.maxSize,
						maxFiles: config.logger.maxFiles
					})
				]
			});

		}
		catch(err) {
			throw err;
		}
	}

	logInfo( message, data) {
		this.logger.log('info', message, data);
	}

	logError( message, data) {
		this.logger.log('error', message, data);
	}

	logWarn( message, data) {
		this.logger.log('warn', message, data);
	}

	logDebug( message, data) {
		this.logger.log('debug', message, data);
	}

	logSilly( message, data) {
		this.logger.log('silly', message, data);
	}
}
