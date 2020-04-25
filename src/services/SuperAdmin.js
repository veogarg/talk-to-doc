import uuid from 'uuid/v1';
import Logger from '../helpers/logger';
import DB from '../helpers/db';
import {accessRoles} from '../../config/constants';
import {generateHash} from '../helpers/jwt';
import {SHA256, SHA512} from '../helpers/encrypt';

export default class SuperAdminServices {

  async init() {
    this.logger = new Logger();
    this.DB = new DB();
    
    await this.logger.init();
    await this.DB.init();
    
    this.db = await this.DB.getDB();
    this.model = this.db.models.SuperAdmin;
    this.queryModel = this.db.models.Queries;
    this.newsletterModel = this.db.models.Newsletter;

  }

  async insert(payload) {
    try {      
      payload.id = uuid();
      payload.createdAt = Date.now();
      payload.updatedAt = Date.now();
      payload.active = true;      
      payload.authPassword = await generateHash(payload.authPassword);
      payload.authToken = await SHA256(`${payload.emailId}-P@r7i@l-${payload.firstName}-${Date.now()}`);
      payload.secretKey = await SHA512(`${payload.emailId}-P@r7i@l-${payload.firstName}-${Date.now()}`);
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
