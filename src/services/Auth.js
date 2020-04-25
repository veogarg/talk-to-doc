import bcrypt from 'bcryptjs';
import Logger from '../helpers/logger';
import DB from '../helpers/db';

export default class Auth {
  async init() {
    this.logger = new Logger();
    this.DB = new DB();

    await this.logger.init();
    await this.DB.init();

    this.db = await this.DB.getDB();
    this.model = this.db.models.SuperAdmin;
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

      const passwordMatch = await bcrypt.compareSync(password, user.authPassword);
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
}
