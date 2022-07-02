import { NUMBER_REGEX } from '../constants';
import { WithdrawOrDepositInput, WithdrawOrDepositResponse } from '../types';

export const validateWithdraw = ({
	cin,
	accountNumber,
	amount,
}: WithdrawOrDepositInput): WithdrawOrDepositResponse | null => {
	if (cin.length != 8) {
		return {
			errors: [
				{
					message: 'cin should contain 8 nums',
					field: 'cin',
				},
			],
		};
	}
	if (!NUMBER_REGEX.test(cin)) {
		return {
			errors: [
				{
					message: 'cin should only contain numbers',
					field: 'cin',
				},
			],
		};
	}
	if (!NUMBER_REGEX.test(accountNumber) || accountNumber.length != 12) {
		return {
			errors: [
				{
					field: 'accountNumber',
					message: 'Account Number must contain 12 numbers',
				},
			],
		};
	}
	if (amount <= 0) {
		return {
			errors: [
				{
					message: 'Please provide a positive amount',
					field: 'amount',
				},
			],
		};
	}
	return null;
};
