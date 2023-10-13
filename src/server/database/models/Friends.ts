import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { User } from './User'

@Table
export class Friends extends Model {
  @Column({ type: DataType.UUID, primaryKey: true, unique: false })
  @ForeignKey(() => User)
  friendId!: string

  @Column({ type: DataType.UUID, primaryKey: true, unique: false })
  @ForeignKey(() => User)
  userId!: string

  @BelongsTo(() => User, 'userId')
  user?: User

  @BelongsTo(() => User, 'friendId')
  friend?: User
}
