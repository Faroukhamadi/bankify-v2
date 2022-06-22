import { Customer } from './entity';

export default {
	Query: {
		async me() {
			const customer = await Customer.findOneBy({ id: 1 });
			return customer;
		},
	},
	Customer: {
		__resolveReference(object: any) {
			return Customer.findBy({ id: object.id });
		},
	},
};
