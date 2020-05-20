import { Config } from './config';

const config: Config = {
  DB_HOST: 'mongodb://localhost:11111/db1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 123,
  HASH_SALT_ROUNDS: 10,
  SESSION_KEY: 'secret cat',
};

export default config;
