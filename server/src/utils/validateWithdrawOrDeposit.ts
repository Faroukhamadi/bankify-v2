import { NUMBER_REGEX } from '../constants';
import { WithdrawOrDepositInput, TransactionResponse } from '../types';

export const validateWithdrawOrDeposit = ({
	cin,
	accountNumber,
	amount,
}: WithdrawOrDepositInput): TransactionResponse | null => {
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
	if (amount === null) {
		return {
			errors: [
				{
					field: 'amount',
					message: 'amount must be a number',
				},
			],
		};
	}
	if (amount <= 0) {
		console.log('why am I inside this if statement', amount);
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
