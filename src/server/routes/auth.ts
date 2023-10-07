import { authApi } from '../api/auth'
import { outputEmptySchema, outputOkSchema } from '../schemas/common'
import { AuthStrategy } from '../enums'
import { ServerRoute } from '@hapi/hapi'
import {
  jwtTokensSchema,
  signupSchema,
  credentialsSchema,
} from '../schemas/auth'

export default <ServerRoute[]>[
  {
    method: 'POST',
    path: '/auth/registration',
    handler: authApi.signup,
    options: {
      auth: false,
      id: 'auth.registration',
      description: 'Sign up',
      tags: ['authApi', 'auth'],
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
    handler: authApi.login,
    options: {
      auth: false,
      id: 'auth.login',
      description: 'Login user',
      tags: ['authApi', 'auth'],
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
    handler: authApi.logout,
    options: {
      id: 'auth.logout',
      description: 'Logout user',
      tags: ['authApi', 'auth'],
      response: {
        schema: outputEmptySchema(),
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/token/refresh',
    handler: authApi.tokenRefresh,
    options: {
      auth: AuthStrategy.JwtRefresh,
      id: 'auth.token.refresh',
      description: 'Use this endpoint to refresh token',
      tags: ['authApi', 'auth'],
      response: {
        schema: outputOkSchema(jwtTokensSchema),
      },
    },
  },
]
