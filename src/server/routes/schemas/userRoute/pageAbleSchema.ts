import Joi from 'joi'

export const pageAbleSchema = (page = 1, limit = 10) =>
  Joi.object({
    page: Joi.number()
      .positive()
      .optional()
      .description('Page number')
      .default(page),
    limit: Joi.number()
      .positive()
      .optional()
      .description('Page limit')
      .default(limit),
  })
