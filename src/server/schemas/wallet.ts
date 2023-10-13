import Joi from 'joi'
import { guidSchema } from './common'

export const walletSchema = Joi.object({
  id: guidSchema,
  balance: Joi.number(),
  userId: guidSchema,
}).label('Wallet')
