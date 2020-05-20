import bodyParser from 'body-parser';
import connectMongo from 'connect-mongo';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';

import 'express-async-errors';
import session from 'express-session';
import * as http from 'http';

import config from './config/config';
import { Auth } from './controllers/Auth/Auth';
import { Hours } from './controllers/Hours/Hours';
import { Users } from './controllers/Users/Users';
import { MongoDatabase } from './Database';
import { Logger } from './utils/logger';

export class App {
  private readonly app: Express;
  private server?: http.Server;

  constructor(private logger: Logger, private db: MongoDatabase) {
    this.app = express();
    this.app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    this.app.use(timeout('5s'));
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(
      session({
        rolling: true,
        resave: false,
        saveUninitialized: false,
        secret: config.SESSION_KEY,
        store: new (connectMongo(session))({
          client: db.client,
        }),
      })
    );

    new Auth(logger, db.users, this.app);
    new Users(logger, db.users, this.app);
    new Hours(logger, db.hours, this.app);

    this.app.use(this.errorRequestHandler);
  }

  private errorRequestHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    this.logger.error(err);
    res.status(500).send({ message: err.message });
  };

  public async listen(port: number) {
    this.logger.info(`Server listening on ${port}`);
    return (this.server = this.app.listen(port, '0.0.0.0'));
  }

  public async close() {
    await this.server?.close();
    await this.db.close();
  }
}
