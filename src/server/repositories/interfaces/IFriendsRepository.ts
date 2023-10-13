import { WhereOptions } from 'sequelize/types'
import { Friends } from '../../database/models/Friends'

export interface IFriendsRepository {
  create: (values: Pick<Friends, 'userId' | 'friendId'>) => Promise<void>

  findOne: (where: WhereOptions<Friends>) => Promise<Friends | null>

  count: (
    col: string,
    distinct?: boolean,
    where?: WhereOptions<Friends>
  ) => Promise<number>

  destroy: (where: WhereOptions<Friends>) => Promise<void>
}
