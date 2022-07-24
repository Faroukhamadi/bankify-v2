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
import { NAME_REGEX, NUMBER_REGEX } from '../constants';
import { Account } from 'src/entities/Account';

@ObjectType()
class CustomerResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Customer, { nullable: true })
	customer?: Customer;
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
}

@Resolver()
export class CustomerResolver {
	@Mutation(() => CustomerResponse)
	async createCustomer(
		@Arg('options')
		{ firstName, lastName, cin, phone, accountNumber }: CustomerInput,
		@Ctx() {}: MyContext
	): Promise<CustomerResponse> {
		let intAccountNumber =
			Math.floor(Math.random() * 999999999999) + 100000000000;
		let account = await Account.findOneBy({
			accountNumber: intAccountNumber.toString(),
		});
		while (account) {
			intAccountNumber =
				Math.floor(Math.random() * 999999999999) + 100000000000;
			account = await Account.findOneBy({
				accountNumber: intAccountNumber.toString(),
			});
		}

		accountNumber = intAccountNumber.toString();

		if (firstName.length <= 2) {
			return {
				errors: [
					{
						field: 'firstName',
						message: 'First Name must contain 3 characters',
					},
				],
			};
		}

		if (lastName.length <= 2) {
			return {
				errors: [
					{
						field: 'lastName',
						message: 'Last Name must contain 3 characters',
					},
				],
			};
		}

		if (!NAME_REGEX.test(firstName)) {
			return {
				errors: [
					{
						field: 'firstName',
						message: 'First Name must contain letters',
					},
				],
			};
		}

		if (!NAME_REGEX.test(lastName)) {
			return {
				errors: [
					{
						field: 'lastName',
						message: 'Last Name must contain letters',
					},
				],
			};
		}

		if (!NUMBER_REGEX.test(cin) || cin.length != 8) {
			return {
				errors: [
					{
						field: 'cin',
						message: 'cin must contain 8 numbers',
					},
				],
			};
		}
		if (!NUMBER_REGEX.test(phone) || phone.length != 8) {
			return {
				errors: [
					{
						field: 'phone',
						message: 'Phone number must contain 8 numbers',
					},
				],
			};
		}
		if (!NUMBER_REGEX.test(accountNumber) || accountNumber.length != 12) {
			return {
				errors: [
					{
						field: 'accountNumber',
						message: 'Account Number must contain 12 numbers',
					},
				],
			};
		}

		const customer = Customer.create({
			firstName,
			lastName,
			cin,
			phone,
			accounts: [
				{
					accountNumber,
				},
			],
		});

		try {
			await customer.save();
		} catch (err) {
			if (err.code === '23505' && err.detail.includes('cin')) {
				return {
					errors: [
						{
							field: 'cin',
							message: 'cin already taken',
						},
					],
				};
			} else if (err.code === '23505' && err.detail.includes('phone')) {
				return {
					errors: [
						{
							field: 'phone',
							message: 'phone already taken',
						},
					],
				};
			}
		}
		return { customer };
	}

	@Query(() => [Customer])
	customers(): Promise<Customer[]> {
		return Customer.find({
			relations: {
				accounts: true,
			},
		});
	}

	// TODO: Fix this resolver
	@Query(() => CustomerResponse)
	async customer(@Arg('cin') cin: string): Promise<CustomerResponse> {
		const customer = await Customer.findOne({
			where: { cin },
			relations: { accounts: true },
		});

		if (!customer) {
			return {
				errors: [
					{
						message: 'customer with specified cin does not exist',
						field: 'cin',
					},
				],
			};
		}

		return { customer };
	}

	@Mutation(() => Customer)
	async deleteCustomer(@Arg('cin', () => String) cin: string) {
		const customer = await Customer.findOneBy({ cin });
		await Customer.delete({ cin });
		return customer;
	}
}
