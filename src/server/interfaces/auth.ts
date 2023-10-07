export interface IJwt {
	access?: string;
	refresh?: string;
}

export interface ICredentials {
	login: string;
	password: string;
}

export interface ISignUpCredentials {
	email: string;
	password: string;
}

export interface ISignUpResendCode {
	email: string;
}
