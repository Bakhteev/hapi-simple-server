import { User } from '../database/models'
import { IUserRepository, userRepository } from '../repositories/UserRepository'
import { Errors, ErrorsMessages, Exception } from '../utils'
import { Op } from 'sequelize'
// import { Op } from 'sequelize'
import { UserScope } from '../database/models/User'

class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getAll(page: number, limit: number, email?: string) {
    const whereOption = email
      ? {
          email: { [Op.like]: `%${email}%` },
        }
      : {}

    return await this.repository.findAll(
      (page - 1) * limit,
      limit,
      UserScope.DEFAULT_SCOPE,
      whereOption
    )
  }

  async getById(id: string) {
    const user = await this.repository.findById(id)
    if (!user) {
      throw new Exception(Errors.NotFound, ErrorsMessages[Errors.NotFound], {
        id,
      })
    }
    return user
  }

  async update(id: string, dto: Pick<User, 'firstName' | 'lastName'>) {
    return await this.repository.update(id, dto)
  }

  async getUserRegistrationStatistics() {}
}

export const userService = new UserService(userRepository)
export type IUserService = UserService
