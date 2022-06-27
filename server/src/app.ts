import express from 'express';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { Account } from './entities/Account';
import { Customer } from './entities/Customer';
import { Teller } from './entities/Teller';
import { Transaction } from './entities/Transaction';

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

	const transactionRepository = myDataSource.getRepository(Transaction);

	const app = express();
	app.use(express.json());

	app.get('/transactions', async (_, res: Response) => {
		const transactions = await transactionRepository.find();
		res.json(transactions);
	});

	app.get('/transactions/:id', async (req: Request, res: Response) => {
		const transaction = await transactionRepository.findOneBy({
			id: parseInt(req.params.id),
		});
		return res.send(transaction);
	});

	app.post('/transactions', (req: Request, res: Response) => {
		// here we will have logic to save a user
	});

	app.put('/transactions/:id', (req: Request, res: Response) => {
		// here we will have logic to update a user by a given user id
	});

	app.delete('/transactions/:id', (req: Request, res: Response) => {
		// here we will have logic to delete a user by a given user id
	});

	// start express server
	app.listen(4001);
};
