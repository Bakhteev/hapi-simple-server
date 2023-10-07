import { User } from 'server/database/models'
import { IUserRepository, userRepository } from '../repositories/UserRepository'

class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async getAll() {
    // try {
    return await this.repository.findAll()
    // } catch (error) {

    // }
  }

  async getById(id: string) {
    return await this.repository.findById(id)
  }

  async update(id: string, dto: Pick<User, 'firstName' | 'lastName'>) {
    return await this.repository.update(id, dto)
  }

  async getUserRegistrationStatistics() {}
}

export const userService = new UserService(userRepository)
export type IUserService = UserService
