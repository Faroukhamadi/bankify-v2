import { ObjectType, Field, registerEnumType } from 'type-graphql';
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
