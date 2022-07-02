<script lang="ts">
	import { INPUT_FIELD } from '$lib/constants';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import Textfield from '@smui/textfield';

	let senderAccountNumberField = { ...INPUT_FIELD };
	let receiverAccountNumberField = { ...INPUT_FIELD };
	let senderCINField = { ...INPUT_FIELD };
	let receiverCINField = { ...INPUT_FIELD };
	let amountField = { ...INPUT_FIELD };
</script>

<h1>Transfer</h1>
<form
	on:submit|preventDefault={async () => {
		// [firstNameField, lastNameField, CINField, phoneField, senderAccountNumberField] = fields =
		// 	await registerCustomer(
		// 		firstNameField,
		// 		lastNameField,
		// 		CINField,
		// 		phoneField,
		// 		senderAccountNumberField
		// 	);
		console.log('submitting...');
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
