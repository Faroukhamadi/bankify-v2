import { ObjectType, Field } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn('increment')
	id!: number;

	@Field(() => String)
	@CreateDateColumn()
	createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	updatedAt: Date;

	@Field(() => String)
	@DeleteDateColumn()
	deletedAt: Date;

	@Field(() => String)
	@Column()
	firstName!: string;

	@Field(() => String)
	@Column()
	lastName!: string;

	@Field(() => String)
	@Column('character varying', { length: 8, unique: true })
	cin: string;

	@Field(() => String)
	@Column('character varying', { length: 8, unique: true })
	phone: string;

	// TODO: add relations

	// @Field(() => Account)
	// @OneToOne(() => Account)
	// @JoinColumn()
	// account?: Account;

	// @Column()
	// password!: string;

	// @OneToMany(() => Transaction, (transaction) => transaction.customer)
	// customerTransactions: Transaction[];

	// @OneToMany(() => Transaction, (transaction) => transaction.sender)
	// senderTransactions: Transaction[];

	// @OneToMany(() => Transaction, (transaction) => transaction.receiver)
	// receiverTransactions: Transaction[];
}
