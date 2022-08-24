import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';
import { TransactionResponse, TransferInput } from './types';
import { validateTransfer } from './utils/validaterTransfer';
import { v4 } from 'uuid';
import cors from 'cors';
import { DEV_ORIGIN } from './constants';

const main = async () => {
	const myDataSource = new DataSource({
		type: 'postgres',
		host: process.env.POSTGRES_HOST || undefined,
		database: process.env.POSTGRES_DB || process.env.POSTGRES_DB_NAME,
		username: process.env.POSTGRES_USER || process.env.POSTGRES_USERNAME,
		password: process.env.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD,
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

	// start express server
	app.listen(4004, () => {
		console.log('transaction service listening on port 4004');
	});
};

main().catch((err) => console.log(err));
