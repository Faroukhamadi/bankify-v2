<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { INPUT_FIELD } from '$lib/constants';
	import { KQL_UpdateTeller } from './graphql/_kitql/graphqlStores';

	let usernameField = { ...INPUT_FIELD };
	let roleField = { ...INPUT_FIELD };
</script>

<!-- TODO: implement updating role -->
<h1>Update Teller</h1>
<form
	on:submit|preventDefault={async () => {
		const res = await KQL_UpdateTeller.mutate({
			variables: {
				options: {
					username: usernameField.content,
					role: roleField.content
				}
			}
		});
		if (res.data?.updateTeller.errors && res.data?.updateTeller.errors[0].field === 'username') {
			usernameField.invalid = true;
			usernameField.errorText = res.data.updateTeller.errors[0].message;
		} else {
			usernameField.invalid = false;
		}
		if (res.data?.updateTeller.errors && res.data?.updateTeller.errors[0].field === 'role') {
			roleField.invalid = true;
			roleField.errorText = res.data.updateTeller.errors[0].message;
		} else {
			roleField.invalid = false;
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
		bind:value={roleField.content}
		label="Role"
		required
		type="text"
	/>
	{#if roleField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{roleField.errorText}</HelperText
		>
	{/if}
	<Button style="min-width: 30rem;" variant="raised">UPDATE TELLER</Button>
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
