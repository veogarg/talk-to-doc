import { RESPONSE_CODES } from '../../config/constants';
import { verifyToken } from './jwt';
import Logger from './logger';

export const authMiddleWare = async  (req, res, next) => {
  try {
    const logger = new Logger();
    await logger.init();
    const ignorePaths = ['/login', '/forgot-password', '/verify-otp'];
    const {
      method,
      headers,
      originalUrl
    } = req;

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const logObj = {
      ip,
      headers: req.headers,
      method: req.method,
      url: req.originalUrl,
      timestamp: Date.now()
    };

    if (method === 'POST' && ( originalUrl === '/user' || originalUrl === '/superadmin') ) {
      logger.logInfo('Activity Log: ', logObj);
      // ignoring register URL
      return next();
    }

    const ignoreIndex = ignorePaths.findIndex(item => item === originalUrl);
    if (ignoreIndex > -1) {
      logger.logInfo('Activity Log: ', logObj);
      return next();
    }

    if (!headers.authorization) {
      logger.logInfo('Activity Log: ', logObj);
      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({ error: 'Missing auth token' });
    }

    logObj.user = verifyToken(headers.authorization);
    logger.logInfo('Activity Log: ', logObj);
    return next();
  }
  catch(error) {
    return res.status(RESPONSE_CODES.UNAUTHORIZED).json({ error });
  }
};
