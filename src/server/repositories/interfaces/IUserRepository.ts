import { Transaction, WhereOptions } from 'sequelize/types'
import { User } from '../../database/models'
import { UserScope } from '../../database/models/User'
import { Includeable } from 'sequelize'

export interface IFindByEmailOptions {
  transaction?: Transaction
}

export interface IFindByLoginOptions {
  transaction?: Transaction
  scope?: string
}

export interface ICreateOptions {
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

  findById: (
    id: string,
    include?: Includeable[]
  ) => Promise<Omit<User, 'password'> | null>

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

  update: (id: string, dto: Partial<User>) => Promise<User | undefined>

  count: (
    column: string,
    distinct?: boolean,
    where?: WhereOptions<User>
  ) => Promise<number>
}
