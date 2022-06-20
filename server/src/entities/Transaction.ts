import { ObjectType, Field, Float } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account';
import { Teller } from './Teller';

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('increment')
	id: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => Account)
	@ManyToOne(() => Account, (account) => account.customerAccountTransactions)
	customerAccount: Account;

	@Field({ nullable: true })
	@Column({ nullable: true })
	customerAccountId: number;

	@Field(() => Account)
	@ManyToOne(() => Account, (account) => account.senderAccountTransactions)
	senderAccount: Account;

	@Field({ nullable: true })
	@Column({ nullable: true })
	senderAccountId: number;

	@Field(() => Account)
	@ManyToOne(() => Account, (account) => account.receiverAccountTransactions)
	receiverAccount: Account;

	@Field({ nullable: true })
	@Column({ nullable: true })
	receiverAccountId: number;

	@Field(() => Teller)
	@ManyToOne(() => Teller, (teller) => teller.transactions)
	teller: Teller;

	@Field()
	@Column()
	tellerId: number;

	@Field(() => Float)
	@Column('real')
	amount: number;
}
