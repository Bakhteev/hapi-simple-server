import Joi from 'joi'

export const statisticSchema = Joi.object({
  from: Joi.date(),
  to: Joi.date(),
  count: Joi.number(),
}).label('Statistics schema')
