<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { KQL_Login } from '$lib/graphql/_kitql/graphqlStores';
	import {} from '$lib/graphql/_kitql/graphqlTypes';

	interface Field {
		invalid: boolean;
		errorText: string;
		content: string;
	}

	async function login(username: string, password: string) {
		console.log('these are the values: ', username, password);
		const result = await KQL_Login.mutate({ variables: { username, password } });
		if (result.data?.login.errors && result.data?.login.errors[0].field === 'username') {
			usernameField.invalid = true;
			usernameField.errorText = result.data.login.errors[0].message;
		} else {
			usernameField.invalid = false;
		}
		if (result.data?.login.errors && result.data?.login.errors[0].field === 'password') {
			passwordField.invalid = true;
			passwordField.errorText = result.data.login.errors[0].message;
		} else {
			passwordField.invalid = false;
		}
	}

	let usernameField: Field = {
		invalid: false,
		errorText: '',
		content: ''
	};

	let passwordField: Field = {
		invalid: false,
		errorText: '',
		content: ''
	};
</script>

<main>
	<h1>Bankify</h1>
	<h2>Sign in</h2>

	<form on:submit|preventDefault={() => login(usernameField.content, passwordField.content)}>
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
		<Button style="min-width: 30rem;" variant="raised" onclick={() => console.log('hello')}
			>SIGN IN</Button
		>
	</form>
</main>

<style>
	h2 {
		font-family: 'Roboto';
		font-weight: 400;
		text-align: center;
	}
	h1 {
		font-family: 'Roboto';
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
		color: #676778;
	}
	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}
</style>
