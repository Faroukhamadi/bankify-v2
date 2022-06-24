import { ObjectType, Field, ID, Float } from 'type-graphql';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	DeleteDateColumn,
	ManyToMany,
	OneToMany,
} from 'typeorm';
import { Customer } from './Customer';
import { Transaction } from './Transaction';

@ObjectType()
@Entity()
export class Account extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('increment')
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => String, { nullable: true })
	@DeleteDateColumn({ nullable: true })
	deletedAt: Date;

	@Field(() => Float)
	@Column('real', { default: 0 })
	balance!: number;

	@Field(() => String)
	@Column('character varying', { length: 12 })
	accountNumber: string;

	@ManyToMany(() => Customer, (customer) => customer.accounts)
	customers: Customer[];

	@OneToMany(() => Transaction, (transaction) => transaction.customerAccount)
	customerAccountTransactions: Transaction[];

	@OneToMany(() => Transaction, (transaction) => transaction.senderAccount)
	senderAccountTransactions: Transaction[];

	@OneToMany(() => Transaction, (transaction) => transaction.receiverAccount)
	receiverAccountTransactions: Transaction[];
}
