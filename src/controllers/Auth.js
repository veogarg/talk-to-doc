import { RESPONSE_CODES } from '../../config/constants';
import Logger from '../helpers/logger';
import Services from '../services/Auth';
import { validator } from '../helpers/schemaValidator';
import { loginSchema, userRegistration } from '../validators/Auth';
import { refreshToken, setResponseToken, verifyToken } from '../helpers/jwt';

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

	async register(req, res) {
		try {
			const {body} = req;
			const {isError, errors} = validator(body, userRegistration);
			if (isError) {
				return res.status(RESPONSE_CODES.BAD_REQUEST).json({error: errors});
			}

			const exists = await this.services.checkEmailExists(body.email);

			if (exists) {
				this.logger.logInfo('Same username Registration tried: ', body);
				return res.status(RESPONSE_CODES.UNAUTHORIZED).json({
					error: 'Email already registered. Please Login to use your account'
				});
			}

			const id = await this.services.insert(body);

			let token;

			if (id) {
				token = refreshToken({
					email: body.email,
					id
				});
				setResponseToken(res, token);
			}
			return res.status(RESPONSE_CODES.POST).json({ id });      
		}
		catch(error) {
			this.logger.logError('Super Admin Registration Error', error);
			return res.status(RESPONSE_CODES.ERROR).json({
				error
			});
		}
	}

	async getUser(req, res) {
		try {
			const { headers: { authorization } } = req;
			let token = authorization;
			const userToken = verifyToken(token);
			// return res.status(RESPONSE_CODES.GET).json({ userToken });
			const user = await this.services.getById(userToken.id);

			//const user = await this.services.getAllAdmin(userToken.id);

			if (user) {
				delete user.authPassword;
				delete user._id;
				delete user.authToken;
				delete user.secretKey;
			}

			token = refreshToken(userToken);
			setResponseToken(res, token);

			return res.status(RESPONSE_CODES.GET).json({ user });
		}
		catch(error) {
			this.logger.logError('Error fetching User Details', error);
			return res.status(RESPONSE_CODES.ERROR).json({ error });
		}
	}

}
