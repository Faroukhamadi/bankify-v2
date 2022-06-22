// import 'reflect-metadata';
// import { DataSource } from 'typeorm';
// import { ApolloServer } from 'apollo-server-express';
// import { buildSchema } from 'type-graphql';
// import express from 'express';
// import session from 'express-session';
// import connectRedis from 'connect-redis';
// import { MyContext } from './types';
// import Redis from 'ioredis';
// import cors from 'cors';
// import 'dotenv/config';
// import { COOKIE_NAME, DEV_ORIGIN } from './constants';
// import { Customer } from './services/customer/entity';
// import { Account } from './services/account/entity';
// import { Teller } from './services/teller/entity';
// import { Transaction } from './services/transaction/entity';
// import { HelloResolver } from './resolvers/hello';
// // only enable this if default playground doesn't work in front-end
// // import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

// declare module 'express-session' {
// 	export interface SessionData {
// 		tellerId: number;
// 	}
// }

// const main = async () => {
// 	const myDataSource = new DataSource({
// 		type: 'postgres',
// 		database: process.env.POSTGRES_DB_NAME,
// 		username: process.env.POSTGRES_USERNAME,
// 		password: process.env.POSTGRES_PASSWORD,
// 		logging: 'all',
// 		synchronize: true,
// 		entities: [Customer, Account, Teller, Transaction],
// 	});
// 	await myDataSource.initialize();

// 	const app = express();

// 	const RedisStore = connectRedis(session);
// 	const redis = new Redis();

// 	console.log('hello');

// 	app.use(
// 		cors({
// 			origin: [DEV_ORIGIN, 'https://studio.apollographql.com'],
// 			credentials: true,
// 		})
// 	);

// 	app.use(
// 		session({
// 			name: COOKIE_NAME,
// 			store: new RedisStore({
// 				client: redis,
// 				disableTouch: true,
// 			}),
// 			secret: process.env.COOKIE_SECRET as string,
// 			resave: false,
// 			saveUninitialized: false,
// 			cookie: {
// 				maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
// 				httpOnly: true,
// 				sameSite: 'lax',
// 				secure: false,
// 			},
// 		})
// 	);

// 	const apolloServer = new ApolloServer({
// 		// plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
// 		schema: await buildSchema({
// 			resolvers: [HelloResolver],
// 			validate: false,
// 		}),
// 		context: ({ req, res }): MyContext => ({
// 			req,
// 			res,
// 			redis,
// 			myDataSource,
// 		}),
// 	});

// 	await apolloServer.start();
// 	apolloServer.applyMiddleware({
// 		app,
// 		cors: false,
// 	});

// 	// app.use((_, res) => {
// 	// 	res.setHeader(
// 	// 		'Access-Control-Allow-Origin',
// 	// 		'https://studio.apollographql.com'
// 	// 	);
// 	// 	res.setHeader('Access-Control-Allow-Credentials', 'true');
// 	// 	res.setHeader('Access-Control-Allow-Headers', ' Content-Type');
// 	// });

// 	app.listen(4000, () => {
// 		console.log('listening on port 4000');
// 	});
// };

// main().catch((err) => console.log(err));
import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
	serviceList: [{ name: 'customer', url: 'http://localhost:4001/graphql' }],
	__exposeQueryPlanExperimental: true,
});

(async () => {
	const server = new ApolloServer({
		gateway,
	});

	server.listen().then(({ url }) => {
		console.log(`server ready at ${url}`);
	});
})();
