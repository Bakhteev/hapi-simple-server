import Joi from 'joi'
import { FIRST_NAME_MAX_LENGTH, LAST_NAME_MAX_LENGTH } from '../../../constants'

export const UpdateUserSchema = Joi.object({
  firstName: Joi.string()
    .max(FIRST_NAME_MAX_LENGTH)
    .description('Users first name'),
  lastName: Joi.string()
    .max(LAST_NAME_MAX_LENGTH)
    .description('Users last name'),
}).label('Update user schema ')
