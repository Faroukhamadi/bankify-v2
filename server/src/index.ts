import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import express from 'express';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import Redis from 'ioredis';
import cors from 'cors';
import 'dotenv/config';
import { COOKIE_NAME, DEV_ORIGIN } from './constants';
import { Customer } from './entities/Customer';
import { Account } from './entities/Account';
import { Teller } from './entities/Teller';
import { HelloResolver } from './resolvers/hello';
import { Transaction } from './entities/Transaction';
import { TellerResolver } from './resolvers/teller';

declare module 'express-session' {
	export interface SessionData {
		tellerId: number;
	}
}

const main = async () => {
	const myDataSource = new DataSource({
		type: 'postgres',
		database: process.env.POSTGRES_DB_NAME,
		username: process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD,
		logging: 'all',
		synchronize: true,
		entities: [Customer, Account, Teller, Transaction],
	});
	await myDataSource.initialize();

	const app = express();

	console.log('database: ', myDataSource.driver.database);

	const RedisStore = connectRedis(session);
	const redis = new Redis();

	app.use(
		cors({
			origin: [DEV_ORIGIN, 'https://studio.apollographql.com'],
			credentials: true,
		})
	);

	app.use(
		session({
			name: COOKIE_NAME,
			store: new RedisStore({
				client: redis,
				disableTouch: true,
			}),
			secret: process.env.COOKIE_SECRET as string,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
				httpOnly: true,
				sameSite: 'lax',
				secure: false,
			},
		})
	);
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, TellerResolver],
			validate: false,
		}),
		context: ({ req, res }): MyContext => ({
			req,
			res,
			redis,
			myDataSource,
		}),
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: false,
	});

	app.listen(4000, () => {
		console.log('listening on port 4000');
	});
};

main().catch((err) => console.log(err));
