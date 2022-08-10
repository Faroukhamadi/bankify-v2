import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';
import { Account } from '../entities/Account';
import { MyContext } from '../types';

@Resolver()
export class AccountResolver {
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
