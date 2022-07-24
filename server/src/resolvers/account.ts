import { Customer } from '../entities/Customer';
import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';
import { Account } from '../entities/Account';
import { MyContext } from '../types';

@ObjectType()
class Error {
	@Field()
	message: string;
}

@ObjectType()
class CredentialsResponse {
	@Field(() => Customer, { nullable: true })
	customer?: Customer;

	@Field(() => Account, { nullable: true })
	account?: Account;

	@Field(() => [Error], { nullable: true })
	errors?: Error[];
}

@Resolver()
export class AccountResolver {
	@Mutation(() => CredentialsResponse, { nullable: false })
	// TODO: reset this if it breaks anything and figure out why it works
	// async createAccount(
	// 	@Arg('userId', () => Int) userId: number
	// ): Promise<CredentialsResponse> {
	// 	const account = Account.create({
	// 		accountNumber: '123456789123',
	// 	});

	// 	const customer = await Customer.findOne({
	// 		where: { id: userId },
	// 		loadRelationIds: true,
	// 	});

	// 	if (!customer) {
	// 		return {
	// 			errors: [
	// 				{
	// 					message: 'user not found',
	// 				},
	// 			],
	// 		};
	// 	}

	// 	if (account.customer) {
	// 		return {
	// 			errors: [
	// 				{
	// 					message: 'user already has an account',
	// 				},
	// 			],
	// 		};
	// 	}

	// 	try {
	// 		await account.save();
	// 	} catch (error) {
	// 		return {
	// 			errors: [
	// 				{
	// 					message: 'I dont know what is causing this error',
	// 				},
	// 			],
	// 		};
	// 	}

	// 	account.customer;

	// 	await account.save();
	// 	return {
	// 		account,
	// 		customer,
	// 	};
	// }
	@Query(() => Int, { nullable: true })
	async balance(
		@Arg('userId', () => Int) userId: number,
		@Ctx() {}: MyContext
	) {
		const account = await Account.findOne({
			where: {
				customer: {
					id: userId,
				},
			},
		});
		if (account?.balance) {
			return account.balance;
		}
		return null;
	}

	@Query(() => [Account])
	async accounts(@Ctx() {}: MyContext): Promise<Account[]> {
		return Account.find({
			relations: {
				customer: true,
			},
		});
	}
}
