import { Op, Transaction, WhereOptions } from 'sequelize'
import { User } from '../database/models'
import { UserStatus } from '../enums'
import { UserScope } from '../database/models/User'

interface IFindByEmailOptions {
  transaction?: Transaction
}

interface IFindByLoginOptions {
  transaction?: Transaction
  scope?: string
}

interface ICreateOptions {
  transaction?: Transaction
}

export interface IUserRepository {
  findAll: (
    offset?: number,
    limit?: number,
    scope?: UserScope,
    where?: WhereOptions<User>
  ) => Promise<{
    count: number
    rows: User[]
  }>

  findById: (id: string) => Promise<Omit<User, 'password'> | null>

  findByEmail: (
    email: string,
    options?: IFindByEmailOptions
  ) => Promise<User | null>

  findByLogin: (
    login: string,
    options: IFindByLoginOptions
  ) => Promise<User | null>

  create: (
    values: Partial<User>,
    options?: ICreateOptions
  ) => Promise<User | null>

  update: (id: string, dto: Partial<User>) => Promise<void>
}

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
