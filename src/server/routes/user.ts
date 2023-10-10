import {
  Request,
  // Request,
  ServerRoute,
} from '@hapi/hapi'
import {
  guidSchema,
  outputEmptySchema,
  outputOkSchema,
  outputPaginationSchema,
} from '../schemas/common'
import { userSchema } from '../schemas/users'
import { UserApi } from '../api/user'
import Joi from 'joi'
import { UserService } from '../services/user'
import { userRepository } from '../repositories/UserRepository'
import { pageAbleSchema } from './schemas/userRoute/pageAbleSchema'
import { emailSearchSchema } from './schemas/userRoute/emailSearchSchema'
import { UserUpdateDto } from 'server/dto/userUpdate.dto'
import { UpdateUserSchema } from './schemas/userRoute/updateUserSchema'

const userService = new UserService(userRepository)
const userApi = new UserApi(userService)

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
        query: pageAbleSchema().concat(emailSearchSchema()),
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
        schema: outputEmptySchema(),
      },
    },
  },
  {
    method: 'Patch',
    path: '/users/update/{id}',
    handler: async (
      req: Request<{
        Params: {
          id: string
        }
        Payload: UserUpdateDto
      }>
    ) => await userApi.updateUser(req),
    options: {
      auth: false,
      tags: ['api', 'users'],
      id: 'users.updateUser',
      description: 'Update user by id',
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
        payload: UpdateUserSchema,
      },
      response: {
        schema: outputOkSchema(userSchema),
      },
    },
  },
  {
    method: 'GET',
    path: '/users/statistics',
    handler: async () => await userApi.getUsersRegistrationStatistics(),
    options: {
      auth: false,
      tags: ['api', 'users'],
      id: 'users.statistics',
      description: 'Get users registration statistics over the recent month',
      // validate: {
      //   params: Joi.object({
      //     id: guidSchema,
      //   }),
      //   payload: UpdateUserSchema,
      // },
      // response: {
      //   schema: outputOkSchema(userSchema),
      // },
    },
  },
]
