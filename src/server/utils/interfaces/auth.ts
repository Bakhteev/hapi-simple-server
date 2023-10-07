import * as Hapi from '@hapi/hapi';
import { Request, } from '@hapi/hapi';

export interface ExtendedAuthenticationData extends Hapi.AuthenticationData {
	readonly isValid: boolean;
}

export type validateFunc = (r: Request, token: string) => Promise<ExtendedAuthenticationData>;
