import bcrypt from 'bcryptjs';
import Logger from '../helpers/logger';
import DB from '../helpers/db';
import uuid from 'uuid/v1';
import {generateHash} from '../helpers/jwt';
import {SHA256, SHA512} from '../helpers/encrypt';

export default class Patient {
	async init() {
		this.logger = new Logger();
		this.DB = new DB();

		await this.logger.init();
		await this.DB.init();

		this.db = await this.DB.getDB();
		this.model = this.db.models.Users;
	}

	async login(payload) {
		try {
			const {
				email,
				password
			} = payload;

			const user = await this.model.findOne({email});
      
			if (!user) {
				return null;
			}

			const passwordMatch = await bcrypt.compareSync(password, user.password);
			if (!passwordMatch) {
				return null;
			}

			return user;

		}
		catch(error) {
			this.logger.logError('Error Logging in Services', error);
			throw error;
		}
	}
  
	async insert(payload) {
		try {      
			payload.id = uuid();
			payload.createdAt = Date.now();
			payload.updatedAt = Date.now();
			payload.active = true;      
			payload.password = await generateHash(payload.password);
			payload.authToken = await SHA256(`${payload.email}-P@r7i@l-${payload.name}-${Date.now()}`);
			payload.secretKey = await SHA512(`${payload.email}-P@r7i@l-${payload.name}-${Date.now()}`);
			const newUser = await this.model.insertOne(payload);
			return payload.id;
		}
		catch (error) {
			this.logger.logError('Insert SuperAdmin Error ', error);
			throw error;
		}
	}

	async getById(id) {
		try {
			const user = await this.model.findOne({ id });

			return user;
		}
		catch(error) {
			this.logger.logError('Error fetching User by ID', error);
			throw error;
		}
	}  

	async checkEmailExists(email) {
		try {
			const superAdmin = await this.model.findOne({ email });
			return !!superAdmin;
		}
		catch (error) {
			this.logger.logError('Checking existing emailId ', error);
			throw error;
		}
	}
  
}
