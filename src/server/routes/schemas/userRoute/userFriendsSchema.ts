import Joi from 'joi'
import { userSchema } from '../../../schemas/users'

export const userFriendsSchema = Joi.object({
  friends: Joi.array().items(userSchema),
})
  .concat(userSchema)
  .label('Users Friends schema')
