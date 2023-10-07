import * as Hapi from '@hapi/hapi';
import { Test, getServerInjectOptions } from './utils';
import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import { getUUID } from '../src/server/utils';
import { ICredentials, ISignUpCredentials } from '../src/server/interfaces';

describe('Auth', () => {
	let server: Hapi.Server;
	let res: any;

	let password: string = 'Password123!!';

	let access: string;
	let refresh: string;

	let email: string = `${getUUID()}@example.com`;

  const signUp: ISignUpCredentials = {
    email,
    password,
  };

	const specialistCred: ICredentials = {
		login: email,
		password,
	};

	beforeAll(async () => {
		server = await Test.start();
	});

	afterAll(async () => {
		await server.stop();
	});

	it('Registration', async () => {
		res = await server.inject(
			getServerInjectOptions('/api/auth/registration', 'POST', null, signUp),
		);

		expect(res.statusCode).toEqual(200);
	});

	it('Login', async () => {
		res = await server.inject(
			getServerInjectOptions('/api/auth/login', 'POST', null, specialistCred),
		);

		access = res.result.result.access;
		refresh = res.result.result.refresh;

		expect(res.statusCode).toEqual(200);
	});

	it('Refresh token', async () => {
		res = await server.inject(getServerInjectOptions('/api/auth/token/refresh', 'POST', refresh));

		expect(res.statusCode).toEqual(200);
		access = res.result.result.access;
		refresh = res.result.result.refresh;
	});

	it('Logout', async () => {
		res = await server.inject(getServerInjectOptions('/api/auth/logout', 'POST', access));
		expect(res.statusCode).toEqual(200);
	});
});
