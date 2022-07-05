<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import login from '$lib/login';
	import { goto } from '$app/navigation';
	import { INPUT_FIELD } from './constants';
	import { KQL_Me } from './graphql/_kitql/graphqlStores';

	let usernameField = { ...INPUT_FIELD };
	let passwordField = { ...INPUT_FIELD };
</script>

<main>
	<h1>Bankify</h1>
	<h2>Sign in</h2>
	<form
		on:submit|preventDefault={async () => {
			[usernameField, passwordField] = await login(usernameField, passwordField);
			if (!usernameField.invalid && !passwordField.invalid) {
				await KQL_Me.query({ settings: { policy: 'network-only' } });
				goto('/');
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
		<!-- might use this for validation -->
		<!-- input$maxlength={10} -->
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
		<Button style="min-width: 30rem;" variant="raised">SIGN IN</Button>
	</form>
</main>

<style>
	h2 {
		font-family: 'Roboto';
		font-weight: 400;
		text-align: center;
		cursor: default;
	}
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
