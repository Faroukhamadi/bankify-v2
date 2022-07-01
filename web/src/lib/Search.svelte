<script lang="ts">
	import { Input } from '@smui/textfield';
	import Paper from '@smui/paper';
	import Fab from '@smui/fab';
	import { Icon } from '@smui/common';
	import { INPUT_FIELD } from './constants';
	import { KQL_Customer } from './graphql/_kitql/graphqlStores';
	import type { Field } from './types';
	import { goto } from '$app/navigation';
	import HelperText from '@smui/textfield/helper-text';

	let cinField = { ...INPUT_FIELD };

	const search = async (cinField: Field) => {
		const res = await KQL_Customer.query({
			variables: { cin: cinField.content }
		});

		if (res.data?.customer.errors) {
			cinField.invalid = true;
			cinField.errorText = res.data.customer.errors[0].message;
		} else {
			goto(`/customers/${cinField.content}`);
		}
		return cinField;
	};
</script>

<form
	on:submit|preventDefault={async () => {
		cinField = await search(cinField);
	}}
>
	<h1 style="font-family: Roboto;">Search For Customer</h1>
	<div class="solo-demo-container solo-container">
		<Paper class="solo-paper" elevation={6}>
			<Icon class="material-icons">search</Icon>
			<Input
				bind:value={cinField.content}
				placeholder="Enter CIN"
				class="solo-input"
				required={true}
			/>
		</Paper>
		<Fab color="primary" mini class="solo-fab">
			<Icon class="material-icons">arrow_forward</Icon>
		</Fab>
	</div>

	{#if cinField.invalid}
		<HelperText style="color: red; font-size: large;" validationMsg persistent slot="helper"
			>{cinField.errorText}</HelperText
		>
	{/if}
</form>

<style>
	h1 {
		font-size: 3rem;
		color: #676778;
		cursor: default;
	}
	form {
		height: 100vh;
		margin-top: 6rem;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.solo-demo-container {
		padding: 36px 18px;
		background-color: var(--mdc-theme-background, #f8f8f8);
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
	}

	.solo-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	* :global(.solo-paper) {
		min-width: 500px;
		display: flex;
		align-items: center;
		flex-grow: 1;
		max-width: 600px;
		margin: 0 12px;
		padding: 0 12px;
		height: 48px;
	}
	* :global(.solo-paper > *) {
		display: inline-block;
		margin: 0 12px;
	}
	* :global(.solo-input) {
		flex-grow: 1;
		color: var(--mdc-theme-on-surface, #000);
	}
	* :global(.solo-input::placeholder) {
		color: var(--mdc-theme-on-surface, #000);
		opacity: 0.6;
	}
	* :global(.solo-fab) {
		flex-shrink: 0;
	}
</style>
