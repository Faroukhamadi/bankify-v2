import { KQL_Login } from './graphql/_kitql/graphqlStores';

interface Field {
	invalid: boolean;
	errorText: string;
	content: string;
}

export default async function (usernameField: Field, passwordField: Field) {
	const result = await KQL_Login.mutate({
		variables: { username: usernameField.content, password: passwordField.content }
	});
	if (result.data?.login.errors && result.data?.login.errors[0].field === 'username') {
		usernameField.invalid = true;
		usernameField.errorText = result.data.login.errors[0].message;
	} else {
		usernameField.invalid = false;
	}
	if (result.data?.login.errors && result.data?.login.errors[0].field === 'password') {
		passwordField.invalid = true;
		passwordField.errorText = result.data.login.errors[0].message;
	} else {
		passwordField.invalid = false;
	}
	return [usernameField, passwordField];
}
