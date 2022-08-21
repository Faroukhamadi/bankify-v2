import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { DataSource, In } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';
import cors from 'cors';
import { DEV_ORIGIN } from './constants';

interface PrevOrNext {
	page: number;
	limit: number;
}

interface PaginatedData {
	results: Array<Transaction>;
	next?: PrevOrNext;
	prev?: PrevOrNext;
}

interface PaginatedQuery {
	page: string;
	limit: string;
}

interface PaginatedParams {
	account_id: string;
}

const main = async () => {
	const myDataSource = new DataSource({
		type: 'postgres',
		host: process.env.POSTGRES_HOST || undefined,
		database: process.env.POSTGRES_DB || process.env.POSTGRES_DB_NAME,
		username: process.env.POSTGRES_USER || process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD,
		logging: 'all',
		// synchronize: true,
		entities: [Customer, Account, Teller, Transaction],
	});

	await myDataSource.initialize();

	const app = express();

	app.use(
		cors({
			origin: [DEV_ORIGIN, 'http://localhost:4000'],
		})
	);

	app.use(express.json());

	app.get(
		'/transactions/count/:account_id',
		async (req: Request<PaginatedParams>, res: Response) => {
			const accountId = parseInt(req.params.account_id);
			const count = await Transaction.count({
				where: [
					{ customerAccountId: accountId },
					{ senderAccountId: accountId },
					{ receiverAccountId: accountId },
				],
			});

			return res.json({
				count,
			});
		}
	);

	app.get('/transactions', async (_, res: Response) => {
		const transactions = await Transaction.find();
		res.json(transactions);
	});

	app.delete('/transactions', async (_, _res: Response) => {
		return Transaction.delete({ id: In([3, 4, 5]) });
	});

	app.get(
		'/transactions/:account_id',
		async (
			req: Request<PaginatedParams, {}, {}, PaginatedQuery>,
			res: Response
		) => {
			const limit = parseInt(req.query.limit);
			const page = parseInt(req.query.page);
			const accountId = parseInt(req.params.account_id);

			const startIndex = (page - 1) * limit;
			const endIndex = page * limit;

			let data: PaginatedData = {
				results: [],
				next: undefined,
				prev: undefined,
			};

			const transactionsLength = await Transaction.count({
				where: [
					{ customerAccountId: accountId },
					{ senderAccountId: accountId },
					{ receiverAccountId: accountId },
				],
			});

			if (endIndex < transactionsLength) {
				data.next = {
					page: page + 1,
					limit: limit,
				};
			}

			if (startIndex > 0) {
				data.prev = {
					page: page - 1,
					limit: limit,
				};
			}

			const transactions = await Transaction.find({
				take: limit,
				skip: startIndex,
				order: {
					createdAt: 'DESC',
				},
				where: [
					{ customerAccountId: accountId },
					{ senderAccountId: accountId },
					{ receiverAccountId: accountId },
				],
				relations: [
					'customerAccount',
					'customerAccount.customer',
					'senderAccount',
					'senderAccount.customer',
					'receiverAccount',
					'receiverAccount.customer',
				],
			});
			data.results = transactions;
			return res.json(data);
		}
	);
	// start express server
	app.listen(4001, () => {
		console.log('transaction service listening on port 4001');
	});
};

main().catch((err) => console.log(err));
