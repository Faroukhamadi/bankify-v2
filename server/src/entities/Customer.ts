import { ObjectType, Field, ID } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Account } from './Account';

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
	@Field(() => ID)
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

	@ManyToMany(() => Account, (account) => account.customers)
	@JoinTable({
		name: 'customer_account',
		joinColumn: {
			name: 'customer_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'account_id',
			referencedColumnName: 'id',
		},
	})
	accounts: Account[];
}
