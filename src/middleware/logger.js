import pinoHttp from 'pino-http';

export const logger = pinoHttp({
  prettyPrint: process.env.NODE_ENV !== 'production',
});
