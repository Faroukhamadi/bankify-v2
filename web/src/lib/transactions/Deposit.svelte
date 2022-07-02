<script lang="ts">
	import { INPUT_FIELD } from '$lib/constants';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Textfield from '@smui/textfield';

	let accountNumberField = { ...INPUT_FIELD };
	let CINField = { ...INPUT_FIELD };
	let amountField = { ...INPUT_FIELD };
</script>

<h1>Deposit</h1>
<form
	on:submit|preventDefault={async () => {
		// [firstNameField, lastNameField, CINField, phoneField, accountNumberField] = fields =
		// 	await registerCustomer(
		// 		firstNameField,
		// 		lastNameField,
		// 		CINField,
		// 		phoneField,
		// 		accountNumberField
		// 	);
		console.log('submitting...');
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
