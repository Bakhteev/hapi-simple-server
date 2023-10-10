import { Op, WhereOptions } from 'sequelize'
import { User, Wallet } from '../database/models'
import { UserStatus } from '../enums'
import { UserScope } from '../database/models/User'
import {
  ICreateOptions,
  IFindByEmailOptions,
  IFindByLoginOptions,
  IUserRepository,
} from './interfaces/IUserRepository'

class UserRepository implements IUserRepository {
  async findAll(
    offset = 0,
    limit = 10,
    scope = UserScope.DEFAULT_SCOPE,
    where = {} as WhereOptions<User>
  ) {
    return await User.scope(scope).findAndCountAll({
      limit,
      offset,
      where,
      include: [Wallet],
    })
  }

  async findById(id: string) {
    return await User.scope('defaultScope').findByPk(id)
  }

  async findByEmail(
    email: string,
    options: IFindByEmailOptions = {}
  ): Promise<User | null> {
    const { transaction } = options

    return User.findOne({
      where: {
        email,
      },
      transaction,
    })
  }

  async findByLogin(
    login: string,
    options: IFindByLoginOptions = {}
  ): Promise<User | null> {
    const { transaction, scope = 'defaultScope' } = options

    return User.scope(scope).findOne({
      where: {
        [Op.or]: [
          {
            email: login,
          },
          {
            phone: login,
          },
        ],
      },
      transaction,
    })
  }

  async create(
    values: Partial<User>,
    options: ICreateOptions = {}
  ): Promise<User | null> {
    const { transaction } = options

    return User.create(
      {
        ...values,
        status: UserStatus.Active,
      },
      {
        transaction,
      }
    )
  }

  async update(id: string, dto: Partial<User>) {
    const user = await this.findById(id)
    await user?.update(dto)
    await user?.save()
  }
}

export const userRepository = new UserRepository()
