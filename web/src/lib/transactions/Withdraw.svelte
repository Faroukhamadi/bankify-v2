<script lang="ts">
	import { INPUT_FIELD } from '$lib/constants';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Textfield from '@smui/textfield';
	import type { TransactionResponse } from '../../../../server/src/types';

	let CINField = { ...INPUT_FIELD };
	let accountNumberField = { ...INPUT_FIELD };
	let amountField = { ...INPUT_FIELD };
	let JSONResponse: TransactionResponse;
</script>

<h1>Withdraw</h1>
<form
	on:submit|preventDefault={async () => {
		const response = await fetch('http://localhost:4001/transactions/withdraw', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cin: CINField.content,
				accountNumber: accountNumberField.content,
				amount: parseInt(amountField.content),
				tellerId: 1
			})
		});
		JSONResponse = await response.json();
		if (JSONResponse.errors && JSONResponse.errors[0].field === 'cin') {
			CINField.invalid = true;
			CINField.errorText = JSONResponse.errors[0].message;
		} else {
			CINField.invalid = false;
		}
		if (JSONResponse.errors && JSONResponse.errors[0].field === 'accountNumber') {
			accountNumberField.invalid = true;
			accountNumberField.errorText = JSONResponse.errors[0].message;
		} else {
			accountNumberField.invalid = false;
		}
		if (JSONResponse.errors && JSONResponse.errors[0].field === 'amount') {
			amountField.invalid = true;
			amountField.errorText = JSONResponse.errors[0].message;
		} else {
			amountField.invalid = false;
		}
	}}
>
	<Textfield
		style="min-width: 30rem;"
		variant="outlined"
		bind:value={CINField.content}
		label="CIN"
		required
		type="text"
	/>
	{#if CINField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{CINField.errorText}</HelperText
		>
	{/if}
	<Textfield
		style="min-width: 30rem;"
		variant="outlined"
		bind:value={accountNumberField.content}
		label="Account Number"
		required
		type="text"
	/>
	{#if accountNumberField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{accountNumberField.errorText}</HelperText
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
