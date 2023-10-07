import * as Hapi from '@hapi/hapi'
import * as Nes from '@hapi/nes'
import * as Inert from '@hapi/inert'
import * as Vision from '@hapi/vision'
import * as Pino from 'hapi-pino'
import * as Basic from '@hapi/basic'
import * as HapiBearer from 'hapi-auth-bearer-token'
import * as HapiPulse from 'hapi-pulse'
import * as HapiSwagger from 'hapi-swagger'
import Qs from 'qs'
import routes from './server/routes/index'
import { tokenValidate } from './server/utils/auth'
import { config, pinoConfig } from './server/config'
import { handleValidationError, responseHandler } from './server/utils'
import { Database } from './server/database/Database'
import { AuthStrategy, AuthToken } from './server/enums'
import { swaggerConfig } from './server/config/swagger'
import { Sequelize } from 'sequelize-typescript'

declare module '@hapi/hapi' {
  export interface ServerApplicationState {
    db: Sequelize
  }
}

export async function init(): Promise<Hapi.Server> {
  const server = new Hapi.Server({
    port: config.server.port,
    host: config.server.host,
    query: {
      parser: (query) => Qs.parse(query),
    },
    routes: {
      cors: config.cors,
      validate: {
        options: {
          abortEarly: false,
        },
        failAction: handleValidationError,
      },
      response: {
        failAction: 'log',
      },
    },
  })
  server.realm.modifiers.route.prefix = '/api'
  await server.register([
    Basic,
    Nes,
    Inert,
    Vision,
    HapiBearer,
  ] as unknown as Array<Hapi.Plugin<unknown>>)
  await server.register({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    plugin: HapiPulse,
    options: {
      timeout: 15000,
      signals: ['SIGINT'],
    },
  })

  await server.register({
    plugin: HapiSwagger,
    options: swaggerConfig,
  })

  server.app.db = await Database.instance()

  if (!config.test) {
    await server.register({
      plugin: Pino,
      options: pinoConfig,
    })
  }

  server.auth.strategy(AuthStrategy.JwtAccess, 'bearer-access-token', {
    validate: tokenValidate(AuthToken.Access),
  })
  server.auth.strategy(AuthStrategy.JwtRefresh, 'bearer-access-token', {
    validate: tokenValidate(AuthToken.Refresh),
  })
  server.auth.default(AuthStrategy.JwtAccess)

  server.route(routes)

  server.ext('onPreResponse', responseHandler)

  try {
    await server.start()
    server.log('info', `Server running at: ${server.info.uri}`)
    server.log('info', 'Node.js version ' + process.versions.node)
  } catch (err) {
    server.log('error', JSON.stringify(err, null, 4))
  }

  return server
}

try {
  if (!config.test) void init()
} catch (err) {
  console.error(err)
}
