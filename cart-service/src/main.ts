import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { PostgresConnection, PGDB } from './pgdb';

const {
  DB_HOST,
  DB_PORT = '5432',
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

let server: Handler;

async function bootstrap() {
  const connection = new PostgresConnection({
    host: DB_HOST,
    port: +DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    }
  });
  PGDB.init(connection);

  return connection.connect().then(() => NestFactory.create(AppModule));
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap().then(async (app) => {
    app.enableCors({
      origin: (req, callback) => callback(null, true),
    });
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return serverlessExpress({ app: expressApp })
  }));
  return server(event, context, callback);
};