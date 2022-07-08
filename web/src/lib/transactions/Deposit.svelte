<script lang="ts">
	import { INPUT_FIELD } from '$lib/constants';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Textfield from '@smui/textfield';
	import CircularProgress from '@smui/circular-progress';
	import type { TransactionResponse } from '../../../../server/src/types';
	import { KQL_Me } from '$lib/graphql/_kitql/graphqlStores';

	let CINField = { ...INPUT_FIELD };
	let accountNumberField = { ...INPUT_FIELD };
	let amountField = { ...INPUT_FIELD };
	let JSONResponse: TransactionResponse;
	let loading = false;
</script>

{#if !loading}
	<h1>Deposit</h1>
	<form
		on:submit|preventDefault={async () => {
			loading = true;
			const teller = await KQL_Me.query();
			const response = await fetch('http://localhost:4001/transactions/deposit', {
				method: 'POST',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					cin: CINField.content,
					accountNumber: accountNumberField.content,
					amount: parseInt(amountField.content),
					tellerId: teller.data?.me?.id
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

			if (!JSONResponse.errors) {
				CINField.content = '';
				accountNumberField.content = '';
				amountField.content = '';
				setTimeout(() => (loading = false), 500);
			} else {
				loading = false;
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
