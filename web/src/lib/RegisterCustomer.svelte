<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { INPUT_FIELD } from '$lib/constants';
	import registerCustomer from './registerCustomer';
	import type { Field } from './types';
	import CircularProgress from '@smui/circular-progress';

	let firstNameField = { ...INPUT_FIELD };
	let lastNameField = { ...INPUT_FIELD };
	let CINField = { ...INPUT_FIELD };
	let phoneField = { ...INPUT_FIELD };
	let fields: Field[] = [];
	let loading = false;
	let showSuccess = false;
</script>

{#if !loading}
	<h1>Register Customer</h1>
	<form
		on:submit|preventDefault={async () => {
			// this is weird
			[firstNameField, lastNameField, CINField, phoneField] = fields = await registerCustomer(
				firstNameField,
				lastNameField,
				CINField,
				phoneField
			);
			loading = true;
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
				showSuccess = true;
				setTimeout(() => (showSuccess = false), 5000);
				setTimeout(() => (loading = false), 500);
			} else {
				loading = false;
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
		<Button style="min-width: 30rem;" variant="raised">CREATE CUSTOMER</Button>
		{#if showSuccess}
			<div class="success-msg">
				<i class="fa fa-check" />
				Success - Customer registered
			</div>
		{/if}
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
		align-items: center;
		gap: 30px;
		height: 69vh;
	}
	.success-msg {
		margin: 10px 0;
		padding: 10px;
		border-radius: 3px 3px 3px 3px;
	}
	.success-msg {
		color: #270;
		background-color: #dff2bf;
		font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial;
		font-weight: 300;
	}
</style>
