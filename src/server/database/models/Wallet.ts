import {
  Model,
  DataType,
  Column,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import { User } from './User'
import { getUUID } from '../../utils'

@Table
export class Wallet extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
    defaultValue: () => getUUID(),
  })
  override id!: string

  @Column({
    type: DataType.DECIMAL,
    defaultValue: 0,
  })
  balance!: number

  @Column(DataType.UUID)
  @ForeignKey(() => User)
  userId!: string

  @BelongsTo(() => User)
  user!: User
}
