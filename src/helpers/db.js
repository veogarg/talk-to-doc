import config from 'config';
//import Sequelize from 'sequelize';
import { MongoClient } from 'mongodb';

export default class DB {
	//seq;
	mongoSession;
	mongod; mongo;
	dbConfig = config.db;
	//mySqlConfig = dbConfig.mysql;
	mongoConfig = this.dbConfig.mongo;

	DB_USERS = 'users';
	DB_USER_LOGS = 'user_logs';
	DB_PATIENT = 'patient_query';	
	DB_DOCTOR = 'doctor_acknowledgements';	

	db = {};
	MONGO_URI = `mongodb://${this.mongoConfig.host}:${this.mongoConfig.port}/${this.mongoConfig.database}`;

	async init() {
		await this.connectMongo();
		await this.setupModels();
	}

	async connectMongo() {
		try {
			this.mongod = await MongoClient.connect(this.MONGO_URI, {useUnifiedTopology: true});
			this.mongo = await this.mongod.db(this.mongoConfig.database);
			this.mongod.withSession(session => {
				this.mongoSession = session;
			});
		}
		catch(err) {
			throw err;
		}
	}

	async setupModels() {
		this.db.models = {};

		this.db.models.Users = this.mongo.collection(this.DB_USERS);
		this.db.models.UserLogs = this.mongo.collection(this.DB_USER_LOGS);
		this.db.models.PatientsQuery = this.mongo.collection(this.DB_PATIENT);
		this.db.models.DoctorAcknowledgements = this.mongo.collection(this.DB_DOCTOR);

		this.db.mongoSession = this.mongoSession;

		this.db.modelNames = {
			users: this.DB_USERS,
			userLogs: this.DB_USER_LOGS,
			patient_query: this.DB_PATIENT,	
			doctor_acknowledgements: this.DB_DOCTOR	
		};
	}

	async getDB() {
		return this.db;
	}

	async checkConnection() {
		if (await this.mongod.isConnected()) {
			return true;
		}

		return false;
	}

}
