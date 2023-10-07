import { Transaction } from 'sequelize'
import { Session, User } from '../database/models'
import { SessionStatus, UserStatus } from '../enums'

class SessionRepository {
  async findActiveSession(
    sessionId: string,
    transaction?: Transaction
  ): Promise<Session | null> {
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
export type ISessionRepository = SessionRepository
