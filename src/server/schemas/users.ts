import Joi from 'joi'
import { emailSchema, guidSchema, stringSchema } from './common'
import { sessionSchema } from './session'

export const userSchema = Joi.object({
  id: guidSchema,
  email: emailSchema,
  phone: Joi.string(),
  status: stringSchema,
  firstName: stringSchema,
  lastName: stringSchema,
  sessions: Joi.array().items(sessionSchema).optional(),
}).label('User schema')
