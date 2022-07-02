import { NUMBER_REGEX } from '../constants';
import { TransferInput, TransactionResponse } from '../types';

export const validateTransfer = ({
	amount,
	receiverAccountNumber,
	receiverCin,
	senderAccountNumber,
	senderCin,
}: TransferInput): TransactionResponse | null => {
	if (senderCin.length != 8) {
		return {
			errors: [
				{
					message: 'senderCin should contain 8 nums',
					field: 'senderCin',
				},
			],
		};
	}
	if (receiverCin.length != 8) {
		return {
			errors: [
				{
					message: 'receiverCin should contain 8 nums',
					field: 'receiverCin',
				},
			],
		};
	}
	if (senderCin === receiverCin) {
		return {
			errors: [
				{
					message: 'receiver and sender cin cannot be the same',
					field: 'senderCin',
				},
			],
		};
	}
	if (senderAccountNumber === receiverAccountNumber) {
		return {
			errors: [
				{
					message: 'receiver and sender account number cannot be the same',
					field: 'senderAccountNumber',
				},
			],
		};
	}
	if (!NUMBER_REGEX.test(senderCin)) {
		return {
			errors: [
				{
					message: 'senderCin should only contain numbers',
					field: 'senderCin',
				},
			],
		};
	}
	if (!NUMBER_REGEX.test(receiverCin)) {
		return {
			errors: [
				{
					message: 'receiverCin should only contain numbers',
					field: 'receiverCin',
				},
			],
		};
	}
	if (
		!NUMBER_REGEX.test(senderAccountNumber) ||
		senderAccountNumber.length != 12
	) {
		return {
			errors: [
				{
					message: 'Sender Account Number must contain 12 numbers',
					field: 'senderAccountNumber',
				},
			],
		};
	}
	if (
		!NUMBER_REGEX.test(receiverAccountNumber) ||
		receiverAccountNumber.length != 12
	) {
		return {
			errors: [
				{
					message: 'Receiver Account Number must contain 12 numbers',
					field: 'receiverAccountNumber',
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
