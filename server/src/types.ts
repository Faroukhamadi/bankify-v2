import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { DataSource } from 'typeorm';
import { Transaction } from './entities/Transaction';
import { FieldError } from './resolvers/teller';

export interface TransactionResponse {
	errors?: FieldError[];
	transaction?: Transaction;
}

export interface WithdrawOrDepositInput {
	cin: string;
	accountNumber: string;
	amount: number;
	tellerId: number;
}

export interface TransferInput {
	senderCin: string;
	receiverCin: string;
	senderAccountNumber: string;
	receiverAccountNumber: string;
	amount: number;
	tellerId: number;
}

export type MyContext = {
	req: Request;
	res: Response;
	redis: Redis;
	myDataSource: DataSource;
};
