import Joi from 'joi'
import { emailSchema, guidSchema, idSchema, stringSchema } from './common'
import { walletSchema } from './wallet'
import { sessionSchema } from './session'

export const userSchema = Joi.object({
  id: guidSchema,

  email: emailSchema,

  phone: Joi.string(),

  status: idSchema,

  firstName: stringSchema,

  lastName: stringSchema,

  sessions: Joi.array().items(sessionSchema).optional(),

  wallet: walletSchema.optional(),
}).label('User schema')
