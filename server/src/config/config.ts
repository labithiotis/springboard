import test from './test';
import development from './development';
import production from './production';

export type Config = {
  DB_HOST: string;
  LOG_LEVEL: string;
  NODE_ENV: string;
  PORT: number;
  HASH_SALT_ROUNDS: number;
  SESSION_KEY: string;
};

export enum NodeEnv {
  test = 'test',
  development = 'development',
  production = 'production',
}

const configs: { [env: string]: Config } = {
  development,
  test,
  production,
};

export default configs[process.env.NODE_ENV || NodeEnv.development];
