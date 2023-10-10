import { outputEmptySchema, outputOkSchema } from '../schemas/common'
import { AuthStrategy } from '../enums'
import { ServerRoute } from '@hapi/hapi'
import {
  jwtTokensSchema,
  signupSchema,
  credentialsSchema,
} from '../schemas/auth'
import { AuthApi } from '../api/auth'
import { AuthService } from '../services/auth'
import { userRepository } from '../repositories/UserRepository'
import { sessionRepository } from '../repositories/SessionRepository'
import { walletRepository } from '../repositories/WalletRepository'

const authService = new AuthService(
  userRepository,
  sessionRepository,
  walletRepository
)
const authApi = new AuthApi(authService)

export default <ServerRoute[]>[
  {
    method: 'POST',
    path: '/auth/registration',
    handler: async (req) => await authApi.signup(req),
    options: {
      auth: false,
      id: 'auth.registration',
      description: 'Sign up',
      tags: ['api', 'auth'],
      validate: {
        payload: signupSchema,
      },
      response: {
        schema: outputEmptySchema(),
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/login',
    handler: async (req) => await authApi.login(req),
    options: {
      auth: false,
      id: 'auth.login',
      description: 'Login user',
      tags: ['api', 'auth'],
      validate: {
        payload: credentialsSchema,
      },
      response: {
        schema: outputOkSchema(jwtTokensSchema),
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: async (req) => await authApi.logout(req),
    options: {
      id: 'auth.logout',
      description: 'Logout user',
      tags: ['api', 'auth'],
      response: {
        schema: outputEmptySchema(),
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/token/refresh',
    handler: async (req) => await authApi.tokenRefresh(req),
    options: {
      auth: AuthStrategy.JwtRefresh,
      id: 'auth.token.refresh',
      description: 'Use this endpoint to refresh token',
      tags: ['api', 'auth'],
      response: {
        schema: outputOkSchema(jwtTokensSchema),
      },
    },
  },
]
