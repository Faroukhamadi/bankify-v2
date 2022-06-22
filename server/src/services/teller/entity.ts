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
import { Transaction } from '../transaction/entity';

enum TellerRole {
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

	@Field(() => String)
	@DeleteDateColumn()
	deletedAt: Date;

	@Field(() => String)
	@Column({ unique: true })
	username!: string;

	@Field(() => TellerRole)
	@Column({
		unique: true,
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
