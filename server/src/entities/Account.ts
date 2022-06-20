import { ObjectType, Field, ID, Float } from 'type-graphql';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	OneToOne,
	DeleteDateColumn,
} from 'typeorm';
import { Customer } from './Customer';

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

	@Field(() => String)
	@DeleteDateColumn()
	deletedAt: Date;

	// HACK: experimental
	@Field(() => Float)
	@Column('real', { default: 0 })
	balance!: number;

	@Field(() => String)
	@Column('character varying', { length: 12 })
	accountNumber: string;

	// @Field(() => Customer)
	// @OneToOne(() => Customer, (customer) => customer.account)
	// customer: Customer;
}
