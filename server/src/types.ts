import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { DataSource } from 'typeorm';
import { Transaction } from './entities/Transaction';
import { FieldError } from './resolvers/teller';

export interface WithdrawOrDepositResponse {
	errors?: FieldError[];
	transaction?: Transaction;
	done?: true;
}

export interface WithdrawOrDepositInput {
	cin: string;
	accountNumber: string;
	amount: number;
	tellerId: number;
}

export type MyContext = {
	req: Request;
	res: Response;
	redis: Redis;
	myDataSource: DataSource;
};
