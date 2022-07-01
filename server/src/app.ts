import 'dotenv/config';
import express from 'express';
import { Request, Response } from 'express';
import { DataSource, In } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';
import { WithdrawInput, WithdrawResponse } from './types';

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
	app.use(express.json());

	app.post(
		'/transactions/withdraw',
		async (
			req: Request<{}, {}, WithdrawInput>,
			res: Response<WithdrawResponse>
		) => {
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

			console.log('customer : ', customer);
			console.log('customer accounts: ', customer?.accounts);

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
			if (amount <= 0) {
				res.json({
					errors: [
						{
							message: 'Please provide a positive amount',
							field: 'amount',
						},
					],
				});
				return;
			}
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

			account!.balance -= amount;
			try {
				await account?.save();
				await transaction.save();
				res.json({
					transaction,
				});
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

	app.delete('/transactions', async (_, res: Response) => {
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
			id: parseInt(req.params.id),
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
