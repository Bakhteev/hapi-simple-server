import { User } from '../database/models'

export type UserUpdateDto = Pick<User, 'firstName' | 'lastName'>
