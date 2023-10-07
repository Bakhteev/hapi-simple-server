import { Server, ServerInjectOptions } from '@hapi/hapi';
import { init } from '../../src/main';

export class Test {
	static server: Server;

	static async start(): Promise<Server> {
		process.env['NODE_ENV'] = 'test';
		Test.server = await init();
		return Test.server;
	}

	static async stop(): Promise<void> {
		await Test.server.app.db.close();
		await Test.server.stop({ timeout: 100 }).then(() => {
			console.log('Server stopped');
		});
		return;
	}
}

export const getServerInjectOptions = <T>(
	url: string,
	method: string,
	jwtToken?: string | null,
	payloadParams?: T,
) => {
	let options: ServerInjectOptions = {
		method,
		url,
	};
	jwtToken
		? (options = Object.assign(options, { headers: { authorization: `Bearer ${jwtToken}` } }))
		: null;
	payloadParams ? (options = Object.assign(options, { payload: payloadParams })) : null;
	return options;
};
