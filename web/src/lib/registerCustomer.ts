import { KQL_CreateCustomer } from './graphql/_kitql/graphqlStores';
import type { Field } from '$lib/types';

export default async function (...fields: Field[]) {
	const res = await KQL_CreateCustomer.mutate({
		variables: {
			options: {
				firstName: fields[0].content,
				lastName: fields[1].content,
				cin: fields[2].content,
				phone: fields[3].content,
				accountNumber: fields[4].content
			}
		}
	});

	if (res.data?.createCustomer.errors && res.data?.createCustomer.errors[0].field === 'firstName') {
		fields[0].invalid = true;
		fields[0].errorText = res.data.createCustomer.errors[0].message;
	} else {
		fields[0].invalid = false;
	}
	if (res.data?.createCustomer.errors && res.data?.createCustomer.errors[0].field === 'lastName') {
		fields[1].invalid = true;
		fields[1].errorText = res.data.createCustomer.errors[0].message;
	} else {
		fields[1].invalid = false;
	}

	if (res.data?.createCustomer.errors && res.data?.createCustomer.errors[0].field === 'cin') {
		fields[2].invalid = true;
		fields[2].errorText = res.data.createCustomer.errors[0].message;
	} else {
		fields[2].invalid = false;
	}
	if (res.data?.createCustomer.errors && res.data?.createCustomer.errors[0].field === 'phone') {
		fields[3].invalid = true;
		fields[3].errorText = res.data.createCustomer.errors[0].message;
	} else {
		fields[3].invalid = false;
	}
	if (
		res.data?.createCustomer.errors &&
		res.data?.createCustomer.errors[0].field === 'accountNumber'
	) {
		fields[4].invalid = true;
		fields[4].errorText = res.data.createCustomer.errors[0].message;
	} else {
		fields[4].invalid = false;
	}
	return fields;
}
