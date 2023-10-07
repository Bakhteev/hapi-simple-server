import * as jwt from 'jsonwebtoken';
import { config, } from '../config';
import { Errors, } from '../utils/errors';
import { error, } from '../utils/common';
import { IJwt, } from '../interfaces';

export class JwtTokenHelper {
	static generateJwt(data: Record<string, unknown>): IJwt {
		const access = JwtTokenHelper.generateAccess(data);
		const refresh = JwtTokenHelper.generateRefresh(data);
		return { access, refresh, };
	}

	static generateAccess(data: Record<string, unknown>): string {
		const refresh = jwt.sign(data, config.auth.jwt.access.secret as jwt.Secret, {
			expiresIn: config.auth.jwt.access.lifetime,
		});

		return refresh;
	}

	static generateRefresh(data: Record<string, unknown>): string {
		const refresh = jwt.sign(data, config.auth.jwt.refresh.secret as jwt.Secret, {
			expiresIn: config.auth.jwt.refresh.lifetime,
		});

		return refresh;
	}

	static decodeJwt(token: string, secret: string): jwt.JwtPayload | string {
		try {
			return jwt.verify(token, secret);
		} catch (err) {
			const e = err as Error;
			throw error(
				e.name === 'TokenExpiredError' ? Errors.AuthTokenExpired : Errors.AuthTokenInvalid,
				e.name === 'TokenExpiredError' ? 'Token expired' : 'Token invalid',
				{}
			);
		}
	}
}
