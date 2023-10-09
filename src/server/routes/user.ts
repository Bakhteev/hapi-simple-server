import {
  Request,
  // Request,
  ServerRoute,
} from '@hapi/hapi'
import {
  guidSchema,
  outputOkSchema,
  outputPaginationSchema,
} from '../schemas/common'
import { userSchema } from '../schemas/users'
import { userApi } from '../api/user'
import Joi from 'joi'

export default <ServerRoute[]>[
  {
    method: 'GET',
    path: '/users',
    handler: (
      req: Request<{
        Query: {
          page: number
          limit: number
          email?: string
        }
      }>
    ) => userApi.getAll(req),
    options: {
      auth: false,
      id: 'users.getAll',
      description: 'Get all users',
      tags: ['api', 'users'],
      validate: {
        query: Joi.object({
          page: Joi.number()
            .positive()
            .optional()
            .description('Page number')
            .default(1),
          limit: Joi.number()
            .positive()
            .optional()
            .description('Page limit')
            .default(10),
          email: Joi.string()
            .optional()
            .description(
              `<p>Search by email</p>
            <p>Valid value</p>
            <ul>
              <li>example</li>
              <li>example@</li>
              <li>exa</li>
              <li>example@mail.ru</li>
            </ul>
            `
            ),
        }),
      },
      response: {
        schema: outputPaginationSchema(userSchema),
      },
    },
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: async (
      req: Request<{
        Params: {
          id: string
        }
      }>
    ) => await userApi.getById(req),
    options: {
      auth: false,
      id: 'users.getById',
      description: 'Get user by id',
      tags: ['api', 'users'],
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: outputOkSchema(userSchema),
      },
    },
  },
]
