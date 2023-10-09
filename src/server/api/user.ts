import { Request } from '@hapi/hapi'
import { userService, IUserService } from '../services/user'
import {
  Errors,
  ErrorsMessages,
  handlerError,
  outputOk,
  outputPagination,
} from '../utils'
import { User } from '../database/models'

class UserApi {
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
    return outputOk<Partial<User>>(user)
  }
}

export const userApi = new UserApi(userService)
