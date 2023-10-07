import Joi from 'joi';
import { EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH, STRING_MAX_LENGTH, } from '../constants';

export function outputEmptySchema(): Joi.Schema {
	return Joi.object({
		ok: okSchema,
	}).label('outputEmptySchema');
}

export function outputOkSchema(res: Joi.Schema): Joi.Schema {
	return Joi.object({
		ok: okSchema,
		result: res,
	}).label('outputOkSchema');
}

export function outputPaginationSchema(res: Joi.Schema): Joi.Schema {
	return Joi.object({
		ok: okSchema,
		result: Joi.object({
			count: Joi.number().integer().example(10),
			rows: Joi.array().items(res),
		}),
	}).label('outputPaginationSchema');
}

export const stringSchema = Joi.string().max(STRING_MAX_LENGTH).label('String');

export const idSchema = Joi.number().example(10).label('id');

export const guidSchema = stringSchema
	.uuid()
	.example('061b73f4-4760-4a53-b038-aff84f50bf59')
	.label('guid');

export const okSchema = Joi.boolean().example(true).label('Ok');

export const emailSchema = Joi.string()
	.email()
	.example('email@example.com')
	.label('Email')
	.max(EMAIL_MAX_LENGTH)
	.min(EMAIL_MIN_LENGTH);

export const passwordSchema = Joi.string()
	.regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}/)
	.example('Example123!!')
	.label('Password')
	.max(255)
	.min(8);
