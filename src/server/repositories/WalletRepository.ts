import { Wallet } from '../database/models'
import { IWalletRepository } from './interfaces/IWalletRepository'

class WalletRepository implements IWalletRepository {
  async create(userId: string) {
    return await Wallet.create<Wallet>({ userId })
  }
}

export const walletRepository = new WalletRepository()
