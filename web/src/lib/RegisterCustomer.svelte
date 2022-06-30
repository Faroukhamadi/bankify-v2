<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { INPUT_FIELD } from '$lib/constants';
	import registerCustomer from './registerCustomer';
	import type { Field } from './types';
	import { goto } from '$app/navigation';

	let firstNameField = { ...INPUT_FIELD };
	let lastNameField = { ...INPUT_FIELD };
	let CINField = { ...INPUT_FIELD };
	let phoneField = { ...INPUT_FIELD };
	let accountNumberField = { ...INPUT_FIELD };
	let fields: Field[] = [];
</script>

<main>
	<h1>Register Customer</h1>
	<form
		on:submit|preventDefault={async () => {
			[firstNameField, lastNameField, CINField, phoneField, accountNumberField] = fields =
				await registerCustomer(
					firstNameField,
					lastNameField,
					CINField,
					phoneField,
					accountNumberField
				);
			let allValid = true;
			fields.forEach((field) => {
				if (field.invalid) {
					allValid = false;
				}
			});
			if (allValid) {
				for (const field of fields) {
					field.content = '';
				}
			}
		}}
	>
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={firstNameField.content}
			label="First Name"
			required
			type="text"
		/>
		{#if firstNameField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{firstNameField.errorText}</HelperText
			>
		{/if}
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={lastNameField.content}
			label="Last Name"
			required
			type="text"
		/>
		{#if lastNameField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{lastNameField.errorText}</HelperText
			>
		{/if}

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
			bind:value={phoneField.content}
			label="Phone"
			required
			type="text"
		/>
		{#if phoneField.invalid}
			<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
				>{phoneField.errorText}</HelperText
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
		<Button style="min-width: 30rem;" variant="raised">CREATE CUSTOMER</Button>
	</form>
</main>

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
