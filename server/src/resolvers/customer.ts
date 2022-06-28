import { Account } from '../entities/Account';
import { Customer } from '../entities/Customer';
import { FieldError } from './teller';
import { MyContext } from '../types';
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';

@ObjectType()
class CustomerResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Customer, { nullable: true })
	customer?: Customer;
}

@InputType()
class FindCustomerInput {
	@Field()
	id: number;
	@Field()
	cin: string;
}

@InputType()
export class CustomerInput {
	@Field()
	firstName: string;
	@Field()
	lastName: string;
	@Field()
	cin: string;
	@Field()
	phone: string;
	@Field()
	accountNumber: string;
	@Field()
	balance: number;
}

@Resolver()
export class CustomerResolver {
	@Mutation(() => CustomerResponse)
	async createCustomer(
		@Arg('options')
		{ firstName, lastName, cin, phone, accountNumber, balance }: CustomerInput,
		@Ctx() {}: MyContext
	): Promise<CustomerResponse> {
		const customer = Customer.create({
			firstName,
			lastName,
			cin,
			phone,
		});
		const account = Account.create({
			accountNumber,
			balance,
		});

		customer.accounts.push(account);

		try {
			await customer.save();
		} catch (err) {
			console.log('customer save:', err);
		}
		return { customer };
	}

	@Query(() => [Customer])
	async customers(): Promise<Customer[]> {
		return Customer.find();
	}

	@Query(() => Customer)
	async customer(
		@Arg('options') { id, cin }: FindCustomerInput
	): Promise<Customer | null> {
		return Customer.findOne({
			where: [{ id }, { cin }],
		});
	}
}
