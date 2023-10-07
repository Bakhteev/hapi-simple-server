import {
  ICredentials,
  IJwt,
  ISignUpCredentials,
} from '../interfaces'
import { Errors, ErrorsMessages, Exception } from '../utils'
import { SessionStatus, UserStatus } from '../enums'
import { JwtTokenHelper } from '../helpers/JwtTokenHelper'
import { IUserRepository, userRepository } from '../repositories/UserRepository'
import {
  ISessionRepository,
  sessionRepository,
} from '../repositories/SessionRepository'

class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository
  ) {}

  public signup = async ({
    email,
    password,
  }: ISignUpCredentials): Promise<void> => {
    let user = await this.userRepository.findByEmail(email)
    if (user)
      throw new Exception(
        Errors.UserAlreadyExist,
        ErrorsMessages[Errors.UserAlreadyExist],
        {
          email,
        }
      )

    user = await this.userRepository.create({
      email,
      password,
    })
  }

  login = async ({ login, password }: ICredentials): Promise<IJwt> => {
    const user = await this.userRepository.findByLogin(login, {
      scope: 'withPassword',
    })

    if (!user || !user.passwordCompare(password))
      throw new Exception(
        Errors.AuthCredentialsIncorrect,
        ErrorsMessages[Errors.AuthCredentialsIncorrect]
      )

    if (user.status !== UserStatus.Active)
      throw new Exception(
        Errors.UserNotActive,
        ErrorsMessages[Errors.UserNotActive]
      )

    const { id: sessionId } = await this.sessionRepository.createUserSession(
      user.id
    )
    const tokens = JwtTokenHelper.generateJwt({ sessionId })

    return tokens
  }

  tokenRefresh = async (
    sessionId: string
  ): Promise<IJwt> => {
    return JwtTokenHelper.generateJwt({
      sessionId,
    })
  }

  public logout = async (sessionId: string): Promise<void> => {
    const session = await this.sessionRepository.findById(
      sessionId
    )

    if (!session)
      throw new Exception(
        Errors.SessionNotFound,
        ErrorsMessages[Errors.SessionNotFound]
      )

    await session.update({
      status: SessionStatus.Finished,
    })
  }
}

export const authService = new AuthService(userRepository, sessionRepository)
export type IAuthService = AuthService
