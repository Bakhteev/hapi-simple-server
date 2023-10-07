import Joi from 'joi'
import { emailSchema, passwordSchema } from './common'
import { AuthToken } from '../enums'

export const jwtTokensSchema = Joi.object({
  access: Joi.string().example(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJjMGQyMTY1ZC00YmNiLTQ0NGEtYTc2My0wZjEyMTcxMmYwOTIiLCJpYXQiOjE2ODI2MTc4MTgsImV4cCI6MTY4MjcwNDIxOH0.5StX-5DxrgMsdO733-nLN5I5pCZPujPUm3PobmBmhuM'
  ),
  refresh: Joi.string().example(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJjMGQyMTY1ZC00YmNiLTQ0NGEtYTc2My0wZjEyMTcxMmYwOTIiLCJpYXQiOjE2ODI2MTc4MTgsImV4cCI6MTY4MzIyMjYxOH0.NppkGl98X-VjjBat5PtyltqlFjAm2lvMbqCDm8w-b70'
  ),
}).label('Jwt Tokens')

export const tokenTypeSchema = Joi.object({
  tokenType: Joi.string()
    .default(AuthToken.Access)
    .valid(...Object.values(AuthToken))
    .example(AuthToken.Access),
}).label('Token Type')

export const signupSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema.required(),
})
  .or('email', 'phone')
  .label('Credentials')
  .label('Sign up')

export const credentialsSchema = Joi.object({
  login: emailSchema.required(),
  password: passwordSchema.required(),
}).label('Credentials')

export const verifyEmailSchema = Joi.object({
  email: emailSchema.required(),
  token: Joi.string().required(),
}).label('Verify email')

export const changePasswordSchema = Joi.object({
  oldPassword: passwordSchema.required(),
  newPassword: passwordSchema.required(),
}).label('Change Password')

export const requestRestorePasswordSchema = Joi.object({
  email: emailSchema.required(),
}).label('Request restore password')

export const restorePasswordSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordSchema.required(),
  token: Joi.string().required(),
}).label('Restore password')
