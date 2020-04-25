import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import DB from '../src/helpers/db';
import Routes from '../src/routes';

import { activityLogger, authMiddleWare } from '../src/helpers/middlewares';

class Server {
  app;
  db;

  async initServer() {
    try {
      this.app = await express();
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(cookieParser());

      this.app.use(express.static(path.join(__dirname, '../', 'public')));

      this.app.use(cors({
        exposeHeaders: ['date', 'content-type', 'content-length', 'connection', 'server',
          'x-powered-by', 'access-control-allow-origin', 'authorization', 'x-final-url'],
        allowHeaders: ['content-type', 'accept', 'authorization']
      }));
      this.app.use(helmet());
      this.app.use(authMiddleWare);

      this.db = new DB();
      await this.db.connectMongo();
      await this.db.setupModels();

      await this.healthCheckRoute();
      await this.healthyDB();

      await this.configureRoutes();

      return this.app;
    }
    catch (err) {
      throw err;
    }
  }

  async healthCheckRoute() {
    try {
      this.app.get('/', (req, res) => {
        res.json({
          status: 'HEALTHY',
          msg: 'This works perfectly fine'
        });
      });
    }
    catch (err) {
      throw err;
    }
  }

  async healthyDB() {
    try {
      if (await this.db.checkConnection()) {
        this.app.get('/health', (req, res) => {
          res.json({
            msg: 'DB Connection Successfull'
          });
        });
        return;
      }

      throw new Error('Error connecting to DB');
    }
    catch(err) {
      throw err;
    }
  }

  async configureRoutes() {
    this.router = express.Router();

    const routes = new Routes(this.router);

    await routes.register();

    this.app.use(this.router);
  }

}

export default Server;
