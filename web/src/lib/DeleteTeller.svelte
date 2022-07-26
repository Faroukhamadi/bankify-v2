<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	import HelperText from '@smui/textfield/helper-text';
	import { INPUT_FIELD } from '$lib/constants';
	import { KQL_DeleteTeller, KQL_Me } from './graphql/_kitql/graphqlStores';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import CircularProgress from '@smui/circular-progress';
	import { Label } from '@smui/button';

	let usernameField = { ...INPUT_FIELD };
	let open = false;
	let loading = false;
	let showSuccess = false;
</script>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<Title id="simple-title">Confirm Delete</Title>
	<Content id="simple-content">Are you sure you want to delete {usernameField.content}</Content>
	<Actions>
		<Button>
			<Label>No</Label>
		</Button>
		<Button
			on:click={async () => {
				const teller = await KQL_Me.query();
				if (usernameField.content === teller.data?.me?.username) {
					usernameField.invalid = true;
					usernameField.errorText = 'Cannot delete logged in teller';
					return;
				}
				const res = await KQL_DeleteTeller.mutate({
					variables: { username: usernameField.content }
				});
				if (
					res.data?.deleteTeller.errors &&
					res.data?.deleteTeller.errors[0].field === 'username'
				) {
					usernameField.invalid = true;
					usernameField.errorText = res.data.deleteTeller.errors[0].message;
				} else {
					usernameField.invalid = false;
					usernameField.content = '';
					showSuccess = true;
					setTimeout(() => (showSuccess = false), 5000);
					setTimeout(() => (loading = false), 500);
				}
			}}
		>
			<Label>Yes</Label>
		</Button>
	</Actions>
</Dialog>

{#if !loading}
	<h1>Delete Teller</h1>
	<form on:submit|preventDefault={() => (open = true)}>
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
		<Button style="min-width: 30rem;" variant="raised">DELETE TELLER</Button>
		{#if showSuccess}
			<div class="success-msg">
				<i class="fa fa-check" />
				Success - Teller deletion completed
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
