import winston, { format, transports } from 'winston';
import Transport from 'winston-transport';

import config, { NodeEnv } from '../config/config';

export type Logger = winston.Logger;

export function createLogger(level: string, customTransports: Transport[] = [new transports.Console()]): Logger {
  return winston.createLogger({
    level,
    format: format.combine.apply(format, [
      ...(config.NODE_ENV === NodeEnv.development ? [format.colorize()] : []),
      format.splat(),
      format.simple(),
    ]),
    transports: [...customTransports],
  });
}

export function InMemoryLogger() {
  return ({
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as any) as Logger;
}

export const logger = createLogger(config.LOG_LEVEL);
