import { PASSWORD_REGEX } from '../constants';
import { UsernamePasswordInput } from './UsernamePasswordInput';

export const validateRegister = (options: UsernamePasswordInput) => {
	if (options.username.length <= 2) {
		return [
			{
				field: 'username',
				message: 'username must contain 3 characters',
			},
		];
	}

	if (options.username.includes('@')) {
		return [
			{
				field: 'username',
				message: 'username cannot include @',
			},
		];
	}
	// reset this in prod
	// if (!PASSWORD_REGEX.test(options.password)) {
	// 	return [
	// 		{
	// 			field: 'password',
	// 			message:
	// 				'minimum 8 characters, at least 1 uppercase, 1 lower, 1 number and 1 special character',
	// 		},
	// 	];
	// }
	return null;
};
