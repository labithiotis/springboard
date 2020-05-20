import { MongoClient, ReadPreference } from 'mongodb';

import { App } from './App';
import config from './config/config';
import { MongoDatabase } from './Database';
import { createLogger } from './utils/logger';

const logger = createLogger(config.LOG_LEVEL);

(async function runApp() {
  logger.info('Application Starting');

  const mongoClient = await MongoClient.connect(config.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: ReadPreference.SECONDARY_PREFERRED,
  });

  const mongo = new MongoDatabase(logger, mongoClient);

  await mongo.init();

  const app = new App(logger, mongo);

  await app.listen(config.PORT);
})().catch(logger.error);
