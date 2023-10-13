import * as bcrypt from 'bcrypt'
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  HasOne,
  IsEmail,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript'
import { UserStatus } from '../../enums'
import { getUUID } from '../../utils'
import { Session } from './Session'
import { Wallet } from './Wallet'
import { Friends } from './Friends'
// import { Friends } from './Friends'

export enum UserScope {
  DEFAULT_SCOPE = 'defaultScope',
  WITH_PASSWORD = 'withPassword',
}

@Scopes({
  [UserScope.DEFAULT_SCOPE]: {
    attributes: {
      exclude: ['password'],
    },
  },
  [UserScope.WITH_PASSWORD]: {
    attributes: {
      include: ['password'],
    },
  },
})
@Table({
  paranoid: true,
})
export class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: () => getUUID(),
  })
  override id!: string

  @IsEmail
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email!: string

  @Column({
    type: DataType.STRING,
  })
  phone!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: UserStatus.New,
  })
  status!: UserStatus

  @Column({ type: DataType.STRING })
  firstName?: string

  @Column({ type: DataType.STRING })
  lastName?: string

  @Column({
    type: DataType.STRING,
    set(value?: string) {
      this.setDataValue('password', value ? User.hashPassword(value) : null)
    },
    get(): string {
      return this.getDataValue('password') as string
    },
  })
  password!: string

  @HasMany(() => Session)
  sessions?: Session[]

  @HasOne(() => Wallet)
  wallet?: Wallet

  @BelongsToMany(() => User, () => Friends, 'friendId', 'userId')
  friends?: User[]

  public passwordCompare(pwd: string): boolean {
    return bcrypt.compareSync(pwd, this.password)
  }

  private static hashPassword(value: string) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(value, salt)

    return hash
  }
}
