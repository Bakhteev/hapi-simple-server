import {
  Model,
  DataType,
  Column,
  Table,
  BelongsTo,
  ForeignKey,
  IsUUID,
} from 'sequelize-typescript'
import { User } from './User'

@Table
export class Wallet extends Model {
  @IsUUID(4)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    allowNull: false,
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
