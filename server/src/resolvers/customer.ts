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

@ObjectType()
class CustomerResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Customer, { nullable: true })
	customer?: Customer;
}

@InputType()
class FindCustomerInput {
	@Field({ nullable: true })
	id?: number;
	@Field({ nullable: true })
	cin?: string;
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
	// @Field()
	// balance: number;
}

@Resolver()
export class CustomerResolver {
	@Mutation(() => CustomerResponse)
	async createCustomer(
		@Arg('options')
		{ firstName, lastName, cin, phone, accountNumber }: CustomerInput,
		@Ctx() {}: MyContext
	): Promise<CustomerResponse> {
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
		console.log(accountNumber.length);

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

		console.log('customer accounts: ', customer.accounts);

		try {
			await customer.save();
		} catch (err) {
			console.log('err', err);
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

	@Query(() => Customer)
	async customer(
		@Arg('options') { id, cin }: FindCustomerInput
	): Promise<Customer | null> {
		return Customer.findOne({
			where: [{ id }, { cin }],
			relations: { accounts: true },
		});
	}

	@Mutation(() => Customer)
	async deleteCustomer(@Arg('cin', () => String) cin: string) {
		const customer = await Customer.findOneBy({ cin });
		await Customer.delete({ cin });
		return customer;
	}
}
