import { Request } from '@hapi/hapi'
import { IUserService } from '../services/user'
import {
  Errors,
  ErrorsMessages,
  Exception,
  handlerError,
  outputEmpty,
  outputOk,
  outputPagination,
} from '../utils'
import { User } from '../database/models'
import { UserUpdateDto } from '../dto/userUpdate.dto'

export class UserApi {
  constructor(private service: IUserService) {}

  public async getAll(
    req: Request<{ Query: { page: number; limit: number; email?: string } }>
  ) {
    try {
      const { page, limit, email } = req.query
      const { count, rows } = await this.service.getAll(page, limit, email)
      return outputPagination<User[]>(count, rows)
    } catch (error) {
      return handlerError(ErrorsMessages[Errors.InternalServerError], error)
    }
  }

  public async getById(req: Request<{ Params: { id: string } }>) {
    const { id } = req.params
    const user = await this.service.getById(id)
    if (!user) {
      const err = new Exception(
        Errors.NotFound,
        ErrorsMessages[Errors.NotFound],
        {
          id,
        }
      )
      return handlerError(ErrorsMessages[Errors.NotFound], err)
    }
    return outputOk<Partial<User>>(user)
  }

  public async updateUser(
    req: Request<{ Payload: UserUpdateDto; Params: { id: string } }>
  ) {
    const { id } = req.params
    const user = await this.service.getById(id)

    if (!user) {
      const err = new Exception(
        Errors.NotFound,
        ErrorsMessages[Errors.NotFound],
        {
          id,
        }
      )
      return handlerError(ErrorsMessages[Errors.NotFound], err)
    }

    const updatedUser = await this.service.updateUser(id, req.payload)
    return outputOk(updatedUser)
  }

  public async getUsersRegistrationStatistics() {
    return this.service.getUserRegistrationStatistics()
  }

  public async addFriend(
    req: Request<{
      Params: {
        id: string
      }
    }>
  ) {
    try {
      const user: User = req.auth.credentials?.user as User
      const friendId: string = req.params.id

      await this.service.addFriend(user.id, friendId)
      await this.service.addFriend(friendId, user.id)
      return outputEmpty()
    } catch (error) {
      console.log(error as Error)

      return handlerError((error as Error).message, error)
    }
  }

  public async getFriends(req: Request<{ Params: { id: string } }>) {
    try {
      const id = req.params.id
      const friends = await this.service.getFriends(id)
      return outputOk(friends)
    } catch (error) {
      return handlerError((error as Error).message, error)
    }
  }

  public async removeFriend(
    req: Request<{
      Params: {
        id: string
      }
    }>
  ) {
    try {
      const user: User = req.auth.credentials?.user as User
      const friendId: string = req.params.id

      await this.service.removeFriend(user.id, friendId)
      await this.service.removeFriend(friendId, user.id)
      return outputEmpty()
    } catch (error) {
      console.log(error as Error)

      return handlerError((error as Error).message, error)
    }
  }

  public async getFriendsAddingStatistics(
    req: Request<{
      Params: {
        id: string
      }
    }>
  ) {
    try {
      const id = req.params.id
      const data = await this.service.getFriendsAddingStatistics(id)
      return outputOk(data)
    } catch (error) {
      console.log(error as Error)

      return handlerError((error as Error).message, error)
    }
  }
}
