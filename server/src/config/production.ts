import { Config } from './config';

const { DB_HOST = '', LOG_LEVEL = 'info', NODE_ENV = 'production', PORT = '8080' } = process.env;

const config: Config = {
  DB_HOST,
  LOG_LEVEL,
  NODE_ENV,
  PORT: +PORT,
  HASH_SALT_ROUNDS: 10,
  SESSION_KEY: 'pp3as41dhb172n',
};

export default config;
