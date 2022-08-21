import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';
import { WithdrawOrDepositInput, TransactionResponse } from './types';
import { validateWithdrawOrDeposit } from './utils/validateWithdrawOrDeposit';
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

	app.post(
		'/transactions/withdraw',
		async (
			req: Request<{}, {}, WithdrawOrDepositInput>,
			res: Response<TransactionResponse>
		) => {
			console.log('body we get on withdraw microservice: ', req.body);
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

	// start express server
	app.listen(4002, () => {
		console.log('transaction service listening on port 4002');
	});
};

main().catch((err) => console.log(err));
