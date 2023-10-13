import { Request, ServerRoute } from '@hapi/hapi'
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
import { statisticSchema } from './schemas/userRoute/statisticShema'
import { userFriendsSchema } from './schemas/userRoute/userFriendsSchema'
import { walletSchema } from '../schemas/wallet'
import { friendsRepository } from '../repositories/FriendsRepository'

const userService = new UserService(userRepository, friendsRepository)
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
      id: 'users.getAll',
      description: 'Get all users',
      tags: ['api', 'users'],
      validate: {
        query: pageAbleSchema()
          .concat(emailSearchSchema())
          .label('pagination schema and email search'),
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
      id: 'users.getById',
      description: 'Get user by id',
      tags: ['api', 'users'],
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: outputOkSchema(
          userSchema.concat(Joi.object({ wallet: walletSchema }))
        ),
      },
    },
  },
  {
    method: 'Patch',
    path: '/users/{id}',
    handler: async (
      req: Request<{
        Params: {
          id: string
        }
        Payload: UserUpdateDto
      }>
    ) => await userApi.updateUser(req),
    options: {
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
      tags: ['api', 'users'],
      id: 'users.statistics',
      description: 'Get users registration statistics over the recent month',
      response: {
        schema: statisticSchema,
      },
    },
  },
  {
    method: 'POST',
    path: '/users/friends/{id}',
    handler: async (req: Request<{ Params: { id: string } }>) =>
      await userApi.addFriend(req),
    options: {
      tags: ['api', 'users'],
      id: 'users.addFriends',
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: outputEmptySchema(),
      },
      description: 'Add user to your friends',
    },
  },
  {
    method: 'GET',
    path: '/users/friends/{id}',
    handler: async (req: Request<{ Params: { id: string } }>) =>
      await userApi.getFriends(req),
    options: {
      tags: ['api', 'users'],
      id: 'users.getFriends',
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: userFriendsSchema,
      },
      description: 'Get all users friends',
    },
  },
  {
    method: 'GET',
    path: '/users/friends/statistics/{id}',
    handler: async (req: Request<{ Params: { id: string } }>) =>
      await userApi.getFriendsAddingStatistics(req),
    options: {
      tags: ['api', 'users'],
      id: 'users.friendsStatistics',
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: statisticSchema,
      },
      description: 'Get users adding friends statistics over the recent month',
    },
  },
  {
    method: 'DELETE',
    path: '/users/friends/{id}',
    handler: async (req: Request<{ Params: { id: string } }>) =>
      await userApi.removeFriend(req),
    options: {
      tags: ['api', 'users'],
      id: 'users.removeFriend',
      validate: {
        params: Joi.object({
          id: guidSchema,
        }),
      },
      response: {
        schema: outputEmptySchema(),
      },
      description: 'Delete user from friends',
    },
  },
]
