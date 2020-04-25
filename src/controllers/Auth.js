import { RESPONSE_CODES } from '../../config/constants';
import { refreshToken, setResponseToken, verifyToken } from '../helpers/jwt';
import Logger from "../helpers/logger";
import Services from '../services/Auth';
import { validator } from '../helpers/schemaValidator';
import { loginSchema } from '../validators/Auth';


export default class Auth {

  async init() {
    this.services = new Services();
    this.logger = new Logger();

    await this.services.init();
    await this.logger.init();
  }

  async login(req, res) {
    try {
      const {body} = req;

      const {isError, errors} = validator(body, loginSchema);

      if (isError) {
        return res.status(RESPONSE_CODES.BAD_REQUEST).json({error: errors});
      }

      const user = await this.services.login(body);
      // return res.status(RESPONSE_CODES.UNAUTHORIZED).json({ user });

      let token;

      if (user) {
        const {
          email,
          id
        } = user;
        token = refreshToken({
          email: email,
          id: id
        });

        delete user.authPassword;
        delete user._id;
        delete user.authToken;
        delete user.secretKey;
        user.token = token;
        setResponseToken(res, token);
        return res.status(RESPONSE_CODES.POST).json({ user, error: null });
      }

      return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
        error: 'Invalid username or password'
      });
    }
    catch(error) {
      this.logger.logError('User Registration Error', error);
      return res.status(RESPONSE_CODES.ERROR).json({
        error
      });
    }
  }

}
