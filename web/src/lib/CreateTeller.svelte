<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { INPUT_FIELD } from '$lib/constants';
	import { KQL_Register } from './graphql/_kitql/graphqlStores';

	let usernameField = { ...INPUT_FIELD };
	let passwordField = { ...INPUT_FIELD };
</script>

<h1>Create Teller</h1>
<form
	on:submit|preventDefault={async () => {
		const res = await KQL_Register.mutate({
			variables: {
				options: {
					username: usernameField.content,
					password: passwordField.content
				}
			}
		});

		if (res.data?.register.errors && res.data?.register.errors[0].field === 'username') {
			usernameField.invalid = true;
			usernameField.errorText = res.data.register.errors[0].message;
		} else {
			usernameField.invalid = false;
		}
		if (res.data?.register.errors && res.data?.register.errors[0].field === 'password') {
			passwordField.invalid = true;
			passwordField.errorText = res.data.register.errors[0].message;
		} else {
			passwordField.invalid = false;
		}
	}}
>
	<Textfield
		style="min-width: 30rem;"
		variant="outlined"
		bind:value={usernameField.content}
		label="Username"
		required
		type="text"
	/>
	{#if usernameField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{usernameField.errorText}</HelperText
		>
	{/if}

	<Textfield
		style="min-width: 30rem;"
		variant="outlined"
		bind:value={passwordField.content}
		label="Password"
		required
		type="password"
	/>
	{#if passwordField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{passwordField.errorText}</HelperText
		>
	{/if}
	<Button style="min-width: 30rem;" variant="raised">CREATE TELLER</Button>
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
		align-items: center;
		gap: 30px;
		height: 69vh;
	}
</style>
