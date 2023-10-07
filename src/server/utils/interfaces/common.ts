import { Options as BoomOptions, } from '@hapi/boom';

export interface IBoomData<T = Record<string, unknown>> extends BoomOptions<T> {
	code: number;
	api: boolean;
	data: T;
}
