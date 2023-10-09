import * as Hapi from '@hapi/hapi'
import { Boom } from '@hapi/boom'
import {
  ICredentials,
  IJwt,
  IOutputEmpty,
  IOutputOk,
  ISignUpCredentials,
} from '../interfaces'
import { handlerError, outputEmpty, outputOk } from '../utils'
import { IAuthService, authService } from '../services/auth'



class AuthApi {
  constructor(private readonly service: IAuthService) {}

  public signup = async (
    r: Hapi.Request
  ): Promise<IOutputEmpty | IOutputOk<{ token?: string }> | Boom> => {
    const credentials = r.payload as ISignUpCredentials
    try {
      await this.service.signup(credentials)
      return outputEmpty()
    } catch (error) {
      return handlerError('Failed to sign-up', error)
    }
  }

  public async login(r: Hapi.Request): Promise<IOutputOk<IJwt> | Boom> {
    const credentials = r.payload as ICredentials

    try {
      const tokens = await this.service.login(credentials)
      return outputOk(tokens)
    } catch (error) {
      return handlerError('Failed to login', error)
    }
  }

  public async tokenRefresh(r: Hapi.Request): Promise<IOutputOk<IJwt> | Boom> {
    const sessionId = String(r.auth.artifacts['sessionId'])

    try {
      const tokens = await this.service.tokenRefresh(sessionId)

      return outputOk(tokens)
    } catch (error) {
      return handlerError('Failed to refresh token', error)
    }
  }

  public async logout(r: Hapi.Request): Promise<IOutputEmpty | Boom> {
    const sessionId = String(r.auth.artifacts['sessionId'])

    try {
      await this.service.logout(sessionId)
      return outputEmpty()
    } catch (error) {
      return handlerError('Failed to logout', error)
    }
  }
}

export const authApi = new AuthApi(authService)
