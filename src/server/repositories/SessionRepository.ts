import { Transaction } from 'sequelize'
import { Session, User } from '../database/models'
import { SessionStatus, UserStatus } from '../enums'
import { ISessionRepository } from './interfaces/ISessionRepository'

class SessionRepository implements ISessionRepository {
  async findActiveSession(sessionId: string, transaction?: Transaction) {
    return Session.findOne({
      where: {
        id: sessionId,
        status: SessionStatus.Active,
      },
      include: [
        {
          model: User,
          where: {
            status: [UserStatus.Active],
          },
          required: true,
        },
      ],
      transaction,
    })
  }

  async findById(id: string) {
    return await Session.findByPk(id)
  }

  async createUserSession(
    userId: string,
    transaction?: Transaction
  ): Promise<Session> {
    return Session.create(
      {
        userId,
        status: SessionStatus.Active,
      },
      {
        transaction,
      }
    )
  }
}

export const sessionRepository = new SessionRepository()
