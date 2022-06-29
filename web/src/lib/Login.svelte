<!-- <script context="module">
	// import type { Load, LoadOutput } from '@sveltejs/kit';
	// export const load: Load = async ({ session }): Promise<LoadOutput> => {
	// 	console.log('inside load function');
	// 	console.log('this is session object: ', session);
	// 	const thing = 'hello';
	// 	return {
	// 		redirect: '/',
	// 		status: 302,
	// 		props: { thing }
	// 	};
	// };
	export async function load() {
		const thing = 'a random string';
		return {
			props: { thing: 'hello' }
		};
	}
</script> -->
<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { KQL_Login, KQL_Me } from '$lib/graphql/_kitql/graphqlStores';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	interface Field {
		invalid: boolean;
		errorText: string;
		content: string;
	}

	// $: {
	// 	browser && KQL_Me.query();
	// }

	async function login(username: string, password: string) {
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

	<form
		on:submit|preventDefault={() => {
			login(usernameField.content, passwordField.content);
			KQL_Me.resetCache();
			KQL_Me.query();
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
