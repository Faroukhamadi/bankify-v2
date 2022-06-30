<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { goto } from '$app/navigation';
	import { DEFAULT_FIELD } from '$lib/constants';

	let firstNameField = { ...DEFAULT_FIELD };
	let lastNameField = { ...DEFAULT_FIELD };
	let CINField = { ...DEFAULT_FIELD };
	let phoneField = { ...DEFAULT_FIELD };
	let accountNumberField = { ...DEFAULT_FIELD };
</script>

<!-- fields are firstName, lastName, CIN, phone, accountNumber -->

<main>
	<h1>Register Customer</h1>
	<form
		on:submit|preventDefault={async () => {
			// [usernameField, passwordField] = await login(usernameField, passwordField);
			// if (!usernameField.invalid && !passwordField.invalid) {
			// 	goto('/');
			// }
			console.log(
				'These are all the values: ',
				firstNameField.content,
				lastNameField.content,
				CINField.content,
				phoneField.content,
				accountNumberField.content
			);
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
