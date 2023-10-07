import { Options as BoomOptions, } from '@hapi/boom';

export * from './auth';

export interface IOutputEmpty {
	ok: boolean;
}

export interface IOutputOk<R = Record<string, string>> {
	ok: boolean;
	result: R;
}

export interface IOutputPagination<R = Record<string, string>> {
	ok: boolean;
	result: {
		count: number[] | number;
		rows: R;
	};
}

export interface IOutputException {
	code: number;
	msg: string;
	data: Record<string, unknown>;
	ok: boolean;
}

export interface IBoomData<T = Record<string, unknown>> extends BoomOptions<T> {
	code: number;
	api: boolean;
	data: T;
}
