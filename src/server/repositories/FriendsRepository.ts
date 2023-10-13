import { WhereOptions } from 'sequelize/types'
import { Friends } from '../database/models/Friends'
import { IFriendsRepository } from './interfaces/IFriendsRepository'

class FriendsRepository implements IFriendsRepository {
  async count(
    col: string,
    distinct: boolean | undefined = false,
    where: WhereOptions<Friends> = {}
  ): Promise<number> {
    return await Friends.count({
      col,
      distinct,
      where,
    })
  }
  async create(values: Pick<Friends, 'friendId' | 'userId'>): Promise<void> {
    const friend = new Friends(values)
    await friend.save()
  }
  async destroy(where: WhereOptions<Friends>): Promise<void> {
    await Friends.destroy({ where })
  }
  async findOne(where: WhereOptions<Friends>): Promise<Friends | null> {
    return await Friends.findOne({ where })
  }
}

export const friendsRepository = new FriendsRepository()
