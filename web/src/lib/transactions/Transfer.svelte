<script lang="ts">
	import { INPUT_FIELD } from '$lib/constants';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';
	import type { TransactionResponse } from '../../../../server/src/types';

	let senderAccountNumberField = { ...INPUT_FIELD };
	let receiverAccountNumberField = { ...INPUT_FIELD };
	let senderCINField = { ...INPUT_FIELD };
	let receiverCINField = { ...INPUT_FIELD };
	let amountField = { ...INPUT_FIELD };
	let JSONResponse: TransactionResponse;
	let loading = false;
</script>

{#if !loading}
	<h1>Transfer</h1>
	<form
		on:submit|preventDefault={async () => {
			const response = await fetch('http://localhost:4001/transactions/transfer', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					senderCin: senderCINField.content,
					receiverCin: receiverCINField.content,
					senderAccountNumber: senderAccountNumberField.content,
					receiverAccountNumber: receiverAccountNumberField.content,
					amount: amountField.content,
					tellerId: 1
				})
			});
			JSONResponse = await response.json();
			if (JSONResponse.errors && JSONResponse.errors[0].field === 'senderCin') {
				senderCINField.invalid = true;
				senderCINField.errorText = JSONResponse.errors[0].message;
			} else {
				senderCINField.invalid = false;
			}
			if (JSONResponse.errors && JSONResponse.errors[0].field === 'receiverCin') {
				receiverCINField.invalid = true;
				receiverCINField.errorText = JSONResponse.errors[0].message;
			} else {
				receiverCINField.invalid = false;
			}
			if (JSONResponse.errors && JSONResponse.errors[0].field === 'senderAccountNumber') {
				senderAccountNumberField.invalid = true;
				senderAccountNumberField.errorText = JSONResponse.errors[0].message;
			} else {
				senderAccountNumberField.invalid = false;
			}
			if (JSONResponse.errors && JSONResponse.errors[0].field === 'receiverAccountNumber') {
				receiverAccountNumberField.invalid = true;
				receiverAccountNumberField.errorText = JSONResponse.errors[0].message;
			} else {
				receiverAccountNumberField.invalid = false;
			}
			if (JSONResponse.errors && JSONResponse.errors[0].field === 'amount') {
				amountField.invalid = true;
				amountField.errorText = JSONResponse.errors[0].message;
			} else {
				amountField.invalid = false;
			}
			if (!JSONResponse.errors) {
				senderAccountNumberField.content = '';
				receiverAccountNumberField.content = '';
				senderCINField.content = '';
				receiverCINField.content = '';
				amountField.content = '';
			}
			setTimeout(() => (loading = false), 500);
		}}
	>
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={senderCINField.content}
			label="Sender CIN"
			required
			type="text"
		/>
		{#if senderCINField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{senderCINField.errorText}</HelperText
			>
		{/if}
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={receiverCINField.content}
			label="Receiver CIN"
			required
			type="text"
		/>
		{#if receiverCINField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{receiverCINField.errorText}</HelperText
			>
		{/if}
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={senderAccountNumberField.content}
			label="Sender Account Number"
			required
			type="text"
		/>
		{#if senderAccountNumberField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{senderAccountNumberField.errorText}</HelperText
			>
		{/if}
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={receiverAccountNumberField.content}
			label="Receiver Account Number"
			required
			type="text"
		/>
		{#if receiverAccountNumberField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{receiverAccountNumberField.errorText}</HelperText
			>
		{/if}
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={amountField.content}
			label="Amount"
			required
			type="text"
		/>
		{#if amountField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{amountField.errorText}</HelperText
			>
		{/if}
		<Button style="min-width: 30rem;" variant="raised">Submit Operation</Button>
	</form>
{:else}
	<div style="display: flex; justify-content: center; align-content: center;">
		<CircularProgress indeterminate style="height: 520px; width: 32px; " />
	</div>
{/if}

<style>
	h1 {
		font-family: 'Roboto';
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
		color: #676778;
		cursor: default;
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}
</style>
