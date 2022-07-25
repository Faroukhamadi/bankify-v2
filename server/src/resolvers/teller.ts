import { Teller } from '../entities/Teller';
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
import { DeleteResult, In } from 'typeorm';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { COOKIE_NAME } from '../constants';
import { UsernamePasswordInput } from '../utils/UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';

@ObjectType()
export class FieldError {
	@Field()
	field?: string;

	@Field()
	message: string;
}

@InputType()
export class UpdateInput {
	@Field(() => String)
	username: string;
	@Field(() => String)
	role: string;
}

@ObjectType()
class TellerResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Teller, { nullable: true })
	teller?: Teller;
}

@Resolver()
export class TellerResolver {
	@Query(() => Teller, { nullable: true })
	me(@Ctx() { req }: MyContext) {
		if (!req.session.tellerId) {
			return null;
		}

		const teller = Teller.findOne({
			where: { id: req.session.tellerId },
		});

		return teller;
	}

	@Mutation(() => TellerResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { req }: MyContext
	): Promise<TellerResponse> {
		const errors = validateRegister(options);
		if (errors) {
			return { errors };
		}
		const hashedPassword = await argon2.hash(options.password);
		const teller = Teller.create({
			username: options.username,
			password: hashedPassword,
		});
		try {
			await teller.save();
		} catch (err) {
			if (err.code === '23505') {
				return {
					errors: [
						{
							field: 'username',
							message: 'username already taken',
						},
					],
				};
			}
		}
		req.session.tellerId = teller.id;
		return { teller };
	}

	@Mutation(() => TellerResponse)
	async login(
		@Arg('username') username: string,
		@Arg('password') password: string,
		@Ctx() { req }: MyContext
	): Promise<TellerResponse> {
		const teller = await Teller.findOne({ where: { username } });
		if (!teller) {
			return {
				errors: [
					{
						field: 'username',
						message: 'username not found',
					},
				],
			};
		}

		const valid = await argon2.verify(teller.password, password);

		if (!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'incorrect password',
					},
				],
			};
		}

		req.session.tellerId = teller.id;

		return {
			teller,
		};
	}

	@Query(() => [Teller])
	async Tellers(@Ctx() {}: MyContext) {
		const tellers = await Teller.find();
		return tellers;
	}

	@Query(() => Teller, { nullable: true })
	Teller(@Arg('id') id: number, @Ctx() {}: MyContext): Promise<Teller | null> {
		return Teller.findOne({ where: { id } });
	}

	@Mutation(() => Teller)
	deleteTellers() {
		return Teller.delete({ id: In([1, 3, 8]) });
	}

	@Mutation(() => Teller)
	async deleteTeller(
		@Arg('username', () => String) username: string
	): Promise<DeleteResult> {
		return await Teller.delete({ username });
	}

	@Mutation(() => TellerResponse)
	async updateTeller(
		@Arg('options') { username, role }: UpdateInput
	): Promise<TellerResponse> {
		if (role.toLowerCase() !== 'customer' && role.toLowerCase() !== 'admin') {
			return {
				errors: [
					{
						field: 'role',
						message: 'Please enter a valid role',
					},
				],
			};
		}
		// @ts-ignore
		const updatedTeller = await Teller.createQueryBuilder()
			.update({
				role: role.toLowerCase(),
			})
			.where({
				username,
			})
			.returning('*')
			.execute();
		if (!updatedTeller.raw[0]) {
			return {
				errors: [
					{
						message: `teller with specified username doesn't exist`,
						field: 'username',
					},
				],
			};
		}
		return {
			teller: updatedTeller.raw[0],
		};
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { req, res }: MyContext) {
		res.clearCookie(COOKIE_NAME);
		// only clears the cookies in redis
		return new Promise((resolve) =>
			req.session.destroy((err) => {
				if (err) {
					resolve(false);
					return;
				}
				resolve(true);
			})
		);
	}
}
