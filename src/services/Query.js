import Logger from '../helpers/logger';
import DB from '../helpers/db';
import uuid from 'uuid/v1';

export default class Query {
	async init() {
		this.logger = new Logger();
		this.DB = new DB();

		await this.logger.init();
		await this.DB.init();

		this.db = await this.DB.getDB();
		this.model = this.db.models.PatientsQuery;
		this.userModel = this.db.models.Users;
		this.docModel = this.db.models.DoctorAcknowledgements;
	}
  
	async insert(payload) {
		try {      
			payload.id = uuid();
			payload.createdAt = Date.now();
			payload.updatedAt = Date.now();
			payload.active = true;
			payload.deletedAt = false;
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
			const myQueries = await this.model.find({ deletedAt: false, patient_id }).sort({createdAt: -1}).toArray();
			return myQueries;
		}
		catch(error) {
			this.logger.logError('Error while fetching queries', error);
			throw error;
		}
	}

	async getAllQueries(){
		try {
			const myQueries = await this.model.find({ deletedAt: false }).sort({createdAt: -1}).toArray();
			return myQueries;
		}
		catch(error) {
			this.logger.logError('Error while fetching queries', error);
			throw error;
		}
	}

	async getQueryDetails(id){
		try {
			const myQueries = await this.model.findOne({ id });
			return myQueries;
		}
		catch(error) {
			this.logger.logError('Error while fetching query details', error);
			throw error;
		}
	}

	async acknowledgement(payload){
		try {
			return payload;
		} catch (error) {
			this.logger.logError('Error while acknowledging query', error);
			throw error;
		}
	}
}
