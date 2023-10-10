import { ICredentials, IJwt, ISignUpCredentials } from '../interfaces'
import { Errors, ErrorsMessages, Exception } from '../utils'
import { SessionStatus, UserStatus } from '../enums'
import { JwtTokenHelper } from '../helpers/JwtTokenHelper'
import { IUserRepository } from '../repositories/interfaces/IUserRepository'
import { ISessionRepository } from '../repositories/interfaces/ISessionRepository'
import { IWalletRepository } from '../repositories/interfaces/IWalletRepository'

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly walletRepository: IWalletRepository
  ) {}

  public async signup({ email, password }: ISignUpCredentials): Promise<void> {
    const candidate = await this.userRepository.findByEmail(email)
    if (candidate)
      throw new Exception(
        Errors.UserAlreadyExist,
        ErrorsMessages[Errors.UserAlreadyExist],
        {
          email,
        }
      )

    const user = await this.userRepository.create({
      email,
      password,
    })
    if (user) {
      console.dir(user)

      await this.walletRepository.create(user.id)

      // return handlerError((err as Error).message, err)
    }
  }

  public async login({ login, password }: ICredentials): Promise<IJwt> {
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

  public async tokenRefresh(sessionId: string): Promise<IJwt> {
    return JwtTokenHelper.generateJwt({
      sessionId,
    })
  }

  public async logout(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId)

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

export type IAuthService = AuthService
