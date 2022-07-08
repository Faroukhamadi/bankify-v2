import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { DataSource, In } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';
import {
	WithdrawOrDepositInput,
	TransactionResponse,
	TransferInput,
} from './types';
import { validateTransfer } from './utils/validaterTransfer';
import { validateWithdrawOrDeposit } from './utils/validateWithdrawOrDeposit';
import { v4 } from 'uuid';
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
		database: process.env.POSTGRES_DB_NAME,
		username: process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD,
		// logging: 'all',
		synchronize: true,
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

	app.post(
		'/transactions/withdraw',
		async (
			req: Request<{}, {}, WithdrawOrDepositInput>,
			res: Response<TransactionResponse>
		) => {
			const errors = validateWithdrawOrDeposit(req.body);
			if (errors) {
				res.json(errors);
				return;
			}
			const { cin, accountNumber, amount, tellerId } = req.body;
			const customer = await Customer.findOne({
				where: { cin },
				relations: { accounts: true },
			});
			if (!customer) {
				res.json({
					errors: [
						{
							message: `customer with specified cin doesn't exist`,
							field: 'cin',
						},
					],
				});
				return;
			}

			if (!customer?.accounts.some((a) => a.accountNumber === accountNumber)) {
				res.json({
					errors: [
						{
							message: `customer with specified cin doesn't have an account with entered account number`,
							field: 'accountNumber',
						},
					],
				});
				return;
			}
			const account = customer?.accounts.find(
				(a) => a['accountNumber'] === accountNumber
			);
			if (account!.balance < amount) {
				res.json({
					errors: [
						{
							message: `Please check your account's balance`,
							field: 'amount',
						},
					],
				});
				return;
			}

			const transaction = Transaction.create({
				amount,
				customerAccountId: account!.id,
				tellerId,
			});

			transaction.id = 'wi:' + v4();

			account!.balance -= amount;
			try {
				await account?.save();
				await transaction.save();
				res.json({
					transaction,
				});
				return;
			} catch (err) {
				res.json({
					errors: [
						{
							message: 'unexpected error',
							field: 'unknown',
						},
					],
				});
				return;
			}
		}
	);

	app.post(
		'/transactions/deposit',
		async (
			req: Request<{}, {}, WithdrawOrDepositInput>,
			res: Response<TransactionResponse>
		) => {
			const errors = validateWithdrawOrDeposit(req.body);
			if (errors) {
				res.json(errors);
				return;
			}
			const { cin, accountNumber, amount, tellerId } = req.body;
			const customer = await Customer.findOne({
				where: { cin },
				relations: { accounts: true },
			});
			if (!customer) {
				res.json({
					errors: [
						{
							message: `customer with specified cin doesn't exist`,
							field: 'cin',
						},
					],
				});
				return;
			}

			if (!customer?.accounts.some((a) => a.accountNumber === accountNumber)) {
				res.json({
					errors: [
						{
							message: `customer with specified cin doesn't have an account with entered account number`,
							field: 'accountNumber',
						},
					],
				});
				return;
			}
			const account = customer?.accounts.find(
				(a) => a['accountNumber'] === accountNumber
			);

			const transaction = Transaction.create({
				amount,
				customerAccountId: account!.id,
				tellerId,
			});

			transaction.id = 'de:' + v4();

			account!.balance += amount;
			try {
				await account?.save();
				await transaction.save();
				res.json({
					transaction,
				});
				return;
			} catch (err) {
				res.json({
					errors: [
						{
							message: 'unexpected error',
							field: 'unknown',
						},
					],
				});
				return;
			}
		}
	);

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

	app.post(
		'/transactions/transfer',
		async (
			req: Request<{}, {}, TransferInput>,
			res: Response<TransactionResponse>
		) => {
			const errors = validateTransfer(req.body);
			if (errors) {
				res.json(errors);
				return;
			}
			const {
				senderCin,
				receiverCin,
				senderAccountNumber,
				receiverAccountNumber,
				amount,
				tellerId,
			} = req.body;
			const sender = await Customer.findOne({
				where: { cin: senderCin },
				relations: { accounts: true },
			});
			const receiver = await Customer.findOne({
				where: { cin: receiverCin },
				relations: { accounts: true },
			});
			if (!sender) {
				res.json({
					errors: [
						{
							message: `sender with specified cin doesn't exist`,
							field: 'senderCin',
						},
					],
				});
				return;
			}

			if (!receiver) {
				res.json({
					errors: [
						{
							message: `receiver with specified cin doesn't exist`,
							field: 'senderCin',
						},
					],
				});
				return;
			}

			if (
				!sender?.accounts.some((a) => a.accountNumber === senderAccountNumber)
			) {
				res.json({
					errors: [
						{
							message: `sender with specified cin doesn't have an account with entered account number`,
							field: 'senderAccountNumber',
						},
					],
				});
				return;
			}
			if (
				!receiver?.accounts.some(
					(a) => a.accountNumber === receiverAccountNumber
				)
			) {
				res.json({
					errors: [
						{
							message: `receiver with specified cin doesn't have an account with entered account number`,
							field: 'receiverAccountNumber',
						},
					],
				});
				return;
			}
			const senderAccount = sender?.accounts.find(
				(a) => a['accountNumber'] === senderAccountNumber
			);
			const receiverAccount = receiver?.accounts.find(
				(a) => a['accountNumber'] === receiverAccountNumber
			);
			if (senderAccount!.balance < amount) {
				res.json({
					errors: [
						{
							message: `Please check the sender's balance`,
							field: 'amount',
						},
					],
				});
				return;
			}

			const transaction = Transaction.create({
				amount,
				receiverAccountId: receiverAccount?.id,
				senderAccountId: senderAccount?.id,
				tellerId,
			});

			transaction.id = 'tr:' + v4();

			senderAccount!.balance -= amount;
			if (typeof amount === 'number') {
				receiverAccount!.balance += amount;
			} else {
				receiverAccount!.balance += parseInt(amount);
			}
			try {
				await senderAccount?.save();
				await receiverAccount?.save();
				await transaction.save();
				res.json({
					transaction,
				});
				return;
			} catch (err) {
				res.json({
					errors: [
						{
							message: 'unexpected error',
							field: 'unknown',
						},
					],
				});
				return;
			}
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
