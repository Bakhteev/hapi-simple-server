import { Wallet } from '../../database/models'

export interface IWalletRepository {
  create(userId: string): Promise<Wallet>
}
