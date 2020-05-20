import { Db, MongoClient } from 'mongodb';
import { HoursStore } from './controllers/Hours/Store';

import { UsersStore } from './controllers/Users/Store';
import { Logger } from './utils/logger';

export const DB_NAME = 'springboard';

export class MongoDatabase {
  db: Db;
  users: UsersStore;
  hours: HoursStore;

  constructor(private logger: Logger, public client: MongoClient) {
    this.db = this.client.db(DB_NAME);
    this.users = new UsersStore(this.logger, this.db);
    this.hours = new HoursStore(this.logger, this.db);
  }

  async init() {
    await this.users.init();
    await this.hours.init();
  }

  async close() {
    await this.client.close();
  }
}
