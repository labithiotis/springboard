import { Config } from './config';

const config: Config = {
  DB_HOST: 'mongodb://localhost:27070/springboard',
  LOG_LEVEL: 'info',
  NODE_ENV: 'development',
  PORT: 3005,
  HASH_SALT_ROUNDS: 10,
  SESSION_KEY: 'secret cat',
};

export default config;
