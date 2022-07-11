import { KitQLClient } from '@kitql/client';

export const kitQLClient = new KitQLClient({
	// url: process.env.BACKEND_GRAPHQL || `http://localhost:4000/graphql`,
	url: `http://localhost:4000/graphql`,
	headersContentType: 'application/json',
	logType: ['client', 'server', 'operationAndvariables'],
	credentials: 'include'
});
