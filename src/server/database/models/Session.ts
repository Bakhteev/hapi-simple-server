import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { SessionStatus } from '../../enums'
import { getUUID } from '../../utils'
import { User } from './User'

@Table
export class Session extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: () => getUUID(),
  })
  override id!: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: SessionStatus

  @BelongsTo(() => User)
  user!: User
}
