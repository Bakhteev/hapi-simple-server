import * as Hapi from '@hapi/hapi'
import { afterAll, beforeAll, expect, it } from '@jest/globals'
import { describe } from '@jest/globals'
import { Test, getServerInjectOptions } from './utils'
import { ICredentials, ISignUpCredentials } from '../src/server/interfaces'
import { getUUID } from '../src/server/utils'
import { User } from '../src/server/database/models'
import { UserUpdateDto } from '../src/server/dto/userUpdate.dto'

describe('Users', () => {
  let server: Hapi.Server

  let password: string = 'Password123!!'

  let access: string

  const userUpdateBody: UserUpdateDto = {
    firstName: 'Test',
    lastName: 'Test',
  }

  beforeAll(async () => {
    server = await Test.start()
    const email: string = `${getUUID()}@example.com`

    const registrationCred: ISignUpCredentials = {
      email,
      password,
    }
    const loginCred: ICredentials = {
      login: email,
      password,
    }
    await server.inject(
      getServerInjectOptions(
        '/api/auth/registration',
        'POST',
        null,
        registrationCred
      )
    )
    const res: any = await server.inject(
      getServerInjectOptions('/api/auth/login', 'POST', null, loginCred)
    )

    access = res.result.result.access
  })

  afterAll(async () => {
    await server.stop()
  })

  it('getUsers', async () => {
    const res = await server.inject(
      getServerInjectOptions('/api/users', 'GET', access)
    )

    expect(res.statusCode).toEqual(200)
  })

  it('Get users by email', async () => {
    const res = await server.inject(
      getServerInjectOptions('/api/users?email=example.com', 'GET', access)
    )

    expect(res.payload.length).toBeDefined()
  })

  it('Update user', async () => {
    const users: any = await server.inject<User[]>(
      getServerInjectOptions('/api/users', 'GET', access)
    )

    const id = users?.result.result.rows[0].id
    
    const res: any = await server.inject<User>(
      getServerInjectOptions(
        '/api/users/' + id,
        'PATCH',
        access,
        userUpdateBody
      )
    )

    expect(res.statusCode).toEqual(200)
    const user = res.result.result
    expect(user.firstName).toEqual(userUpdateBody.firstName)
    expect(user.lastName).toEqual(userUpdateBody.lastName)
  })

  it('addfriend', async () => {
    const users: any = await server.inject<User[]>(
      getServerInjectOptions('/api/users', 'GET', access)
    )

    const id = users?.result.result.rows[0].id

    const res: any = await server.inject<User>(
      getServerInjectOptions(
        '/api/users/addFriend/' + id,
        'GET',
        access,
      )
    )

    expect(res.statusCode).toEqual(200)

  })
})
