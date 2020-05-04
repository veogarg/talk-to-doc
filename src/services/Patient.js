import Logger from '../helpers/logger';
import DB from '../helpers/db';
import uuid from 'uuid/v1';

export default class Patient {
	async init() {
		this.logger = new Logger();
		this.DB = new DB();

		await this.logger.init();
		await this.DB.init();

		this.db = await this.DB.getDB();
		this.model = this.db.models.PatientsQuery;
		this.userModel = this.db.models.Users;
	}
  
	async insert(payload) {
		try {      
			payload.id = uuid();
			payload.createdAt = Date.now();
			payload.updatedAt = Date.now();
			payload.active = true;
			payload.is_deleted = false;
			await this.model.insertOne(payload);
			return payload.id;
		}
		catch (error) {
			this.logger.logError('Error While registering query ', error);
			throw error;
		}
	}

	async getById(id) {
		try {
			const user = await this.userModel.findOne({ id });
			return user;
		}
		catch(error) {
			this.logger.logError('Error fetching User by ID', error);
			throw error;
		}
	}

	async getMyQueries(patient_id){
		try {
			const myQueries = await this.model.find({ is_deleted: false, patient_id }).sort({createdAt: -1}).toArray();
			return myQueries;
		}
		catch(error) {
			this.logger.logError('Error while fetching queries', error);
			throw error;
		}
	}

	async getAllQueries(){
		try {
			const myQueries = await this.model.find({ is_deleted: false }).sort({createdAt: -1}).toArray();
			return myQueries;
		}
		catch(error) {
			this.logger.logError('Error while fetching queries', error);
			throw error;
		}
	}
}
