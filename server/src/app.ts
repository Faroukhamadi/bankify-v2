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
			console.log('we are in withdraw');
			console.log('this is the data we got from the browser: ', req.body);

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
			if (account!.balance - amount < 0) {
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
				console.log('unexpected err:', err);
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
			console.log('we are in deposit');
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
				console.log('unexpected err:', err);
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
		'/transactions/transfer',
		async (
			req: Request<{}, {}, TransferInput>,
			res: Response<TransactionResponse>
		) => {
			console.log('we are in transfer');
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
							field: 'cin',
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
							field: 'cin',
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
			if (senderAccount!.balance - amount < 0) {
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
			receiverAccount!.balance += amount;
			try {
				await senderAccount?.save();
				await receiverAccount?.save();
				await transaction.save();
				res.json({
					transaction,
				});
				return;
			} catch (err) {
				console.log('unexpected err:', err);
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

	app.get('/tellers', async (_req, res) => {
		const tellers = await Teller.find();
		res.json(tellers);
	});

	app.get('/customers', async (_req: Request, res: Response) => {
		const customers = await Customer.find({
			relations: {
				accounts: true,
			},
		});
		return res.send(customers);
	});

	app.get('/transactions/:id', async (req: Request, res: Response) => {
		const transaction = await Transaction.findOneBy({
			id: req.params.id,
		});
		return res.send(transaction);
	});

	app.post('/transactions', (_: Request, _r: Response) => {
		// here we will have logic to save a user
	});

	app.put('/transactions/:id', (_: Request, _r: Response) => {
		// here we will have logic to update a user by a given user id
	});

	app.delete('/transactions/:id', (_: Request, _r: Response) => {
		// here we will have logic to delete a user by a given user id
	});

	// start express server
	app.listen(4001, () => {
		console.log('transaction service listening on port 4001');
	});
};

main().catch((err) => console.log(err));
