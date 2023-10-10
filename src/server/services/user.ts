import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import { Op } from 'sequelize'
import { User, UserScope } from '../database/models/User'
import { UserUpdateDto } from '../dto/userUpdate.dto'
import { startOfMonth, endOfMonth } from 'date-fns'
export class UserService {
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
    return await this.repository.findById(id)
  }

  async updateUser(id: string, dto: UserUpdateDto) {
    return await this.repository.update(id, dto)
  }

  async getUserRegistrationStatistics() {
    const lastMonthStartDate = startOfMonth(new Date())
    const lastMonthEndDate = endOfMonth(new Date())
    const count = await User.count<User>({
      distinct: true,
      col: 'id',
      where: {
        createdAt: { [Op.between]: [lastMonthStartDate, lastMonthEndDate] },
      },
    })
    return {
      from: lastMonthStartDate,
      to: lastMonthEndDate,
      count,
    }
  }
}

export type IUserService = UserService
