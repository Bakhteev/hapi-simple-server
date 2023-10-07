export enum Errors {
  BadRequest = 400000,
  Unauthorized = 401000,
  Forbidden = 403000,
  NotFound = 404000,
  NotAcceptable = 406000,
  Conflict = 409000,
  Gone = 410000,
  UnsupportedMediaType = 415000,
  TooManyRequests = 429000,
  InternalServerError = 500000,

  // --- 1xx Authorization

  // 10x Registration

  AuthAlreadyActivated = 403100,

  // 11x Login

  AuthCredentialsIncorrect = 400110,
  SessionNotFound = 404111,
  AuthTokenExpired = 401112,
  AuthTokenInvalid = 401113,
  AuthBlocked = 401114,

  // 12x Restore

  RestorePasswordNotConfirmed = 403120,

  // 13x Change password

  AuthInvalidOldPassword = 400130,

  // --- 2xx User

  // 20x Find

  UserNotFound = 404200,

  // 21x Create

  UserAlreadyExist = 403210,

  // 22x Check

  UserNotActive = 403220,
}

export const ErrorsMessages = {
  [Errors.AuthAlreadyActivated]: 'Errors.Authorization.AlreadyActivated',
  [Errors.AuthCredentialsIncorrect]:
    'Errors.Authorization.CredentialsIncorrect',
  [Errors.AuthInvalidOldPassword]: 'Errors.Authorization.InvalidOldPassword',
  [Errors.AuthTokenExpired]: 'Errors.Authorization.TokenExpired',
  [Errors.AuthTokenInvalid]: 'Errors.Authorization.TokenInvalid',
  [Errors.BadRequest]: 'Errors.BadRequest',
  [Errors.Conflict]: 'Errors.Conflict',
  [Errors.Forbidden]: 'Errors.Forbidden',
  [Errors.InternalServerError]: 'Errors.InternalServerError',
  [Errors.NotAcceptable]: 'Errors.NotAcceptable',
  [Errors.NotFound]: 'Errors.NotFound',
  [Errors.RestorePasswordNotConfirmed]: 'Errors.Restore.PasswordNotConfirmed',
  [Errors.SessionNotFound]: 'Errors.Session.NotFound',
  [Errors.TooManyRequests]: 'Errors.TooManyRequests',
  [Errors.Unauthorized]: 'Errors.Unauthorized',
  [Errors.UnsupportedMediaType]: 'Errors.UnsupportedMediaType',
  [Errors.UserAlreadyExist]: 'Errors.User.AlreadyExist',
  [Errors.UserNotActive]: 'Errors.User.NotActive',
  [Errors.UserNotFound]: 'Errors.User.NotFound',
}
