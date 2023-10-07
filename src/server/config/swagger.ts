import { RegisterOptions, } from 'hapi-swagger';
import { config, } from './config';

export const swaggerConfig: RegisterOptions = {
	pathPrefixSize: 2,
	basePath: '/api/',
	host: config.baseUrl,
	grouping: 'tags',
	info: {
		title: 'API Documentation',
		version: '1.0',
		description: 'API Documentation',
	},
	securityDefinitions: {
		Bearer: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
			'x-keyPrefix': 'Bearer ',
		},
	},
	security: [
		{
			Bearer: [],
		}
	],
	schemes: ['http', 'https'],
	jsonPath: '/swagger.json',
	documentationPath: '/swagger',
	debug: true,
};
