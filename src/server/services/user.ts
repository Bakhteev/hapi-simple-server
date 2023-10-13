import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import { Op } from 'sequelize'
import { User, UserScope } from '../database/models/User'
import { UserUpdateDto } from '../dto/userUpdate.dto'
import { startOfMonth, endOfMonth } from 'date-fns'
import { Errors, Exception } from '../utils'
import { IFriendsRepository } from 'server/repositories/interfaces/IFriendsRepository'
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly friendsRepository: IFriendsRepository
  ) {}

  async getAll(page: number, limit: number, email?: string) {
    const whereOption = email
      ? {
          email: { [Op.like]: `%${email}%` },
        }
      : {}

    return await this.userRepository.findAll(
      (page - 1) * limit,
      limit,
      UserScope.DEFAULT_SCOPE,
      whereOption
    )
  }

  async getById(id: string) {
    return await this.userRepository.findById(id)
  }

  async updateUser(id: string, dto: UserUpdateDto) {
    return await this.userRepository.update(id, dto)
  }

  async getUserRegistrationStatistics() {
    const lastMonthStartDate = startOfMonth(new Date())
    const lastMonthEndDate = endOfMonth(new Date())
    const count = await this.userRepository.count('id', true, {
      createdAt: { [Op.between]: [lastMonthStartDate, lastMonthEndDate] },
    })
    return {
      from: lastMonthStartDate,
      to: lastMonthEndDate,
      count,
    }
  }

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new Exception(Errors.BadRequest, 'You can not add yourSelf', {
        friendId,
      })
    }
    const friend = await this.getById(friendId)
    if (!friend) {
      throw new Exception(Errors.NotFound, 'User not Found', {
        friendId,
      })
    }

    const data = await this.friendsRepository.findOne({
      where: { userId, friendId },
    })

    if (data) {
      throw new Exception(Errors.BadRequest, 'User is your friend already', {
        friendId,
      })
    }

    await this.friendsRepository.create({
      userId,
      friendId,
    })
  }

  async getFriends(userId: string) {
    const user = await this.userRepository.findById(userId, [
      { model: User, through: { attributes: [] } },
    ])
    return user
  }

  async removeFriend(userId: string, friendId: string) {
    const data = await this.friendsRepository.findOne({ userId, friendId })
    if (!data) {
      throw new Exception(Errors.BadRequest, 'User is not your friend', {
        friendId,
      })
    }
    await this.friendsRepository.destroy({ userId, friendId })
  }

  async getFriendsAddingStatistics(userId: string) {
    const lastMonthStartDate = startOfMonth(new Date())
    const lastMonthEndDate = endOfMonth(new Date())
    const count = await this.friendsRepository.count('userId', true, {
      createdAt: { [Op.between]: [lastMonthStartDate, lastMonthEndDate] },
      userId,
    })
    return {
      from: lastMonthStartDate,
      to: lastMonthEndDate,
      count,
    }
  }
}

export type IUserService = UserService
