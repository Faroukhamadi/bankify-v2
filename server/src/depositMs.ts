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
		'/transactions/deposit',
		async (
			req: Request<{}, {}, WithdrawOrDepositInput>,
			res: Response<TransactionResponse>
		) => {
			console.log('body we get on deposit microservice: ', req.body);

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
			// this exists for testing purposes because in dev user should be logged in to do this
			const teller = await Teller.findOneBy({ id: tellerId });
			if (!teller) {
				res.json({
					errors: [
						{
							message: `teller with specified id doesn't exist`,
							field: 'tellerId',
						},
					],
				});
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

			// @ts-ignore
			account!.balance += parseInt(amount);
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
	app.listen(4003, () => {
		console.log('transaction service listening on port 4003');
	});
};

main().catch((err) => console.log(err));
