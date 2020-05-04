import { RESPONSE_CODES } from '../../config/constants';
import { verifyToken } from '../helpers/jwt';
import Logger from '../helpers/logger';
import Services from '../services/Patient';
import { validator } from '../helpers/schemaValidator';
import { newQuery } from '../validators/patient';


export default class QueryController {

	async init() {
		this.services = new Services();
		this.logger = new Logger();

		await this.services.init();
		await this.logger.init();
	}

	async saveQuery(req, res) {
		try {
			const {body} = req;
			const {isError, errors} = validator(body, newQuery);
			if (isError) {
				return res.status(RESPONSE_CODES.BAD_REQUEST).json({error: errors});
			}
			const { headers: { authorization } } = req;
			let token = authorization;
			const userToken = verifyToken(token);
			const user = await this.services.getById(userToken.id);

			if(!user){
				return res.status(RESPONSE_CODES.UNAUTHORIZED).json({error: 'Unauthorized. User Not Found'});
			}
			const data = {
				query: body.query,
				patient_id : user.id
			};
			const id = await this.services.insert(data);

			return res.status(RESPONSE_CODES.POST).json({ id });
		}
		catch(error) {
			this.logger.logError('Oops! Query not registered', error);
			return res.status(RESPONSE_CODES.ERROR).json({
				error
			});
		}
	}

	async getMyQueries(req, res) {
		try {
			const { headers: { authorization } } = req;
			let token = authorization;
			const userToken = verifyToken(token);
			const user = await this.services.getById(userToken.id);			
			if(!user){
				return res.status(RESPONSE_CODES.UNAUTHORIZED).json({error: 'Unauthorized. User Not Found'});
			}
			const queries = await this.services.getMyQueries(user.id);

			return res.status(RESPONSE_CODES.GET).json({ queries });
		}
		catch(error) {
			this.logger.logError('Error fetching User Details', error);
			return res.status(RESPONSE_CODES.ERROR).json({ error });
		}
	}

	async getAllQueries(req, res){
		try {
			const { headers: { authorization } } = req;
			let token = authorization;
			const userToken = verifyToken(token);
			const user = await this.services.getById(userToken.id);			
			if(!user){
				return res.status(RESPONSE_CODES.UNAUTHORIZED).json({error: 'Unauthorized. User Not Found'});
			}
			const queries = await this.services.getAllQueries();

			return res.status(RESPONSE_CODES.GET).json({ queries });
		}
		catch(error) {
			this.logger.logError('Error fetching User Details', error);
			return res.status(RESPONSE_CODES.ERROR).json({ error });
		}
	}
}
