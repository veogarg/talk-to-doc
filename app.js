import cluster from 'cluster';
import http from 'http';
import os from 'os';
import config from 'config';
import Logger from './src/helpers/logger';

import Server from './bin/server';


class Application {

  app;
  logger;
  address; bind;
  port;
  server;
  serverObj;
  numCPUs;

  async initApp() {
    this.port = config.port;
    this.serverObj = new Server();
    this.app = await this.serverObj.initServer();
    this.logger = new Logger();
    await this.logger.init();
    this.app.set('port', this.port);
    await this.initAppServer();
  }

  async initAppServer() {
    this.numCPUs = os.cpus().length;
    if (cluster.isMaster) {
      let i = 0;
      for (i=0; i<this.numCPUs; i++) {
        await cluster.fork();
      }

      await cluster.on('exit', (worker, code, signal) => {
        this.logger.logError(`Cluster Worker died | worker: ${worker.process.pid}`);
      });
    }
    else {
      try {
        this.server = await http.createServer(this.app);
        this.server.listen(this.port);
        await this.server.on('listening', () => {
          this.address = this.server.address();
          this.bind = typeof this.address === 'string' ? `pipe ${this.address}` : `port ${this.address.port}`;
          this.logger.logDebug(`Listening On: ${this.bind}`);
          this.logger.logInfo(`Server running on: ${this.port}`);
        });
      }
      catch(err) {
        console.error(err);
        throw err;
      }
    }
  }
}

const app = new Application();

(async () => {
  process.setMaxListeners(0);
  await app.initApp();
})();
