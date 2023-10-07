import { Boom, } from '@hapi/boom';
import { v4 as uuidv4, } from 'uuid';
import { IBoomData, } from './interfaces/common';
import { IOutputEmpty, IOutputException, IOutputOk, IOutputPagination, } from '../interfaces';
import { Request, ResponseObject, ResponseToolkit, } from '@hapi/hapi';
import { ValidationError, } from 'joi';

export function getUUID(): string {
	return uuidv4();
}

export function outputEmpty(): IOutputEmpty {
	return {
		ok: true,
	};
}

export function outputOk<R>(result: R): IOutputOk<R> {
	return {
		ok: true,
		result,
	};
}

export function outputPagination<R>(count: number[] | number, rows: R): IOutputPagination<R> {
	return {
		ok: true,
		result: {
			count,
			rows,
		},
	};
}

export function error<T>(code: number, msg: string, data: T = {} as T): Boom<IBoomData<T>> {
	return new Boom(msg, {
		data: {
			code,
			data,
			api: true,
		},
		statusCode: Math.floor(code / 1000),
	});
}

export function responseHandler(r: Request, h: ResponseToolkit): ResponseObject | symbol {
	const response = r.response as Boom;

	if (response.isBoom && response.data === null) {
		r.response = h
			.response(<IOutputException>{
				ok: false,
				code: Math.floor(response.output.statusCode * 1000),
				data: {},
				msg: response.message,
			})
			.code(response.output.statusCode);
		return r.response;
	}

	/* eslint-disable */
	if (response.isBoom && response.data.api) {
		r.response = h
			.response(<IOutputException>{
				ok: false,
				code: response.data.code,
				data: response.data.data,
				msg: response.output.payload.message,
			})
			.code(Math.floor(response.data.code / 1000));
		return r.response;
	}

	if (response.isBoom && !response.data.api) {
		r.response = h
			.response(<IOutputException>{
				ok: false,
				code: Math.floor(response.output.statusCode * 1000),
				data: response.data,
				msg: response.message,
			})
			.code(response.output.statusCode);
		return r.response;
	}

	return h.continue;
}

export function handleValidationError(
	_request: Request,
	_h: ResponseToolkit,
	err: Error | undefined,
): Boom {
	const errors = err as ValidationError;
	return error(
		400000,
		'Validation error',
		errors.details.map((e) => ({
			field: e.context?.key,
			reason: e.type.replace('any.', ''),
		})),
	);
}

export function getIPFromRequestHeaders(r: Request): string {
	return r.headers['x-forwarded-for'] ?? '127.0.0.1';
}
