import { ObjectType, Field, registerEnumType, ID } from 'type-graphql';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Transaction } from './Transaction';

export enum TellerRole {
	CUSTOMER = 'customer',
	ADMIN = 'admin',
}

registerEnumType(TellerRole, {
	name: 'TellerRole',
});

@ObjectType()
@Entity()
export class Teller extends BaseEntity {
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

	@Field(() => String)
	@Column({ unique: true })
	username!: string;

	@Field(() => TellerRole)
	@Column({
		type: 'enum',
		enum: TellerRole,
		default: TellerRole.CUSTOMER,
	})
	role: TellerRole;

	@Column()
	password!: string;

	@OneToMany(() => Transaction, (transaction) => transaction.teller)
	transactions: Transaction[];
}
