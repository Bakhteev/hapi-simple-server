import { config as dotenvConfig } from 'dotenv'

dotenvConfig()

export const config = {
  baseUrl: String(process.env['DOMAIN_NAME']),
  dbLink: String(process.env['DATABASE_LINK']),
  testDbLink: String(process.env['TEST_DATABASE_LINK']),
  auth: {
    jwt: {
      access: {
        secret: String(process.env['AUTH_JWT_ACCESS_SECRET']),
        lifetime: Number(process.env['AUTH_JWT_ACCESS_LIFETIME']),
      },
      refresh: {
        secret: String(process.env['AUTH_JWT_REFRESH_SECRET']),
        lifetime: Number(process.env['AUTH_JWT_REFRESH_LIFETIME']),
      },
    },
    restorePassTimeout: 60,
    restorePassTokenLive: 3600,
  },
  cors: {
    origin: process.env['CORS_ORIGIN']
      ? (JSON.parse(process.env['CORS_ORIGIN']) as string[])
      : ['*'],
    maxAge: process.env['CORS_MAX_AGE']
      ? Number(process.env['CORS_MAX_AGE'])
      : 600,
    headers: process.env['CORS_HEADERS']
      ? (JSON.parse(process.env['CORS_HEADERS']) as string[])
      : ['Accept', 'Content-Type', 'Authorization'],
    credentials:
      process.env['CORS_ALLOW_CREDENTIALS'] === 'true' ? true : false,
    exposedHeaders: process.env['CORS_EXPOSE_HEADERS']
      ? (JSON.parse(process.env['CORS_EXPOSE_HEADERS']) as string[])
      : ['content-type', 'content-length', 'Content-Disposition'],
  },
  server: {
    port: process.env['SERVER_PORT']
      ? Number(process.env['SERVER_PORT'])
      : 3000,
    host: process.env['SERVER_HOST'] ? process.env['SERVER_HOST'] : 'localhost',
    shutdownTimeout: process.env['SERVER_SHUTDOWN_TIMEOUT']
      ? Number(process.env['SERVER_SHUTDOWN_TIMEOUT'])
      : 15000,
  },
  debug: process.env['DEBUG'] === 'true' ? true : false,
  development: process.env['NODE_ENV'] === 'development' ? true : false,
  test: process.env['NODE_ENV'] === 'test' ? true : false,
  production: process.env['NODE_ENV'] === 'production' ? true : false,
}
