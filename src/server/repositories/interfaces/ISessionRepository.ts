import { Transaction } from 'sequelize'
import { Session } from '../../database/models'

export interface ISessionRepository {
  findActiveSession(
    sessionId: string,
    transaction: Transaction
  ): Promise<Session | null>

  findById(id: string): Promise<Session | null>

  createUserSession(userId: string, transaction?: Transaction): Promise<Session>
}
