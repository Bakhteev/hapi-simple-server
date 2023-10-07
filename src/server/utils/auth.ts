import { AuthToken } from '../enums'
import { Request } from '@hapi/hapi'
import { config } from '../config'
import { Errors, ErrorsMessages } from './errors'
import { error } from './common'
import { JwtTokenHelper } from '../helpers/JwtTokenHelper'
import { sessionRepository } from '../repositories/SessionRepository'
import { ExtendedAuthenticationData, validateFunc } from './interfaces/auth'

export function tokenValidate(tokenType: AuthToken): validateFunc {
  return async function (
    _r: Request,
    token: string
  ): Promise<ExtendedAuthenticationData> {
    const { sessionId } = JwtTokenHelper.decodeJwt(
      token,
      config.auth.jwt[`${tokenType}`].secret
    ) as {
      sessionId: string
    }

    if (!sessionId) {
      throw error(
        Errors.AuthTokenInvalid,
        ErrorsMessages[Errors.AuthTokenInvalid]
      )
    }

    const session = await sessionRepository.findActiveSession(sessionId)

    if (session) {
      return {
        isValid: true,
        credentials: { user: session.user },
        artifacts: { token, type: tokenType, sessionId: session.id },
      }
    }

    throw error(Errors.SessionNotFound, ErrorsMessages[Errors.SessionNotFound])
  }
}
