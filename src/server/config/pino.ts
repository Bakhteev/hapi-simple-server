import * as Hapi from '@hapi/hapi';

export const pinoConfig = {
	serializers: {
		req: function customReqSerializer(req: Hapi.Request) {
			return {
				method: req.method,
				url: req.url,
				payload: req.payload,
			};
		},
		res: function customResSerializer(res: { statusCode: string; result: object; data: object }) {
			return {
				code: res.statusCode,
				payload: res.result,
				data: res.data,
			};
		},
	},
	logPayload: true,
	logEvents: ['response', 'request'],
	logQueryParams: true,
	redact: {
		paths: [
			'payload.password',
			'payload.newPassword',
			'payload.oldPassword',
			'req.headers.authorization',
			'payload.file.payload'
		],
		censor: '***',
	},
	timestamp: () => `,"time":"${new Date(Date.now()).toLocaleString()}"`,
};
