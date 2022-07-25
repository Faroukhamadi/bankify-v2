<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { KQL_Logout, KQL_Me } from '$lib/graphql/_kitql/graphqlStores';
	import { get } from 'svelte/store';

	export const load: Load = async ({ fetch }) => {
		// @ts-ignore
		await KQL_Me.queryLoad({ fetch });
		const res = get(KQL_Me);
		if (!res.data?.me) {
			return {
				redirect: '/login',
				status: 302,
				props: {
					role: res.data?.me?.role
				}
			};
		}
		return {
			props: {
				role: res.data?.me?.role
			}
		};
	};
</script>

<script lang="ts">
	import Search from '$lib/Search.svelte';
	import Register from '$lib/RegisterCustomer.svelte';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import Fab from '@smui/fab/src/Fab.svelte';
	import { goto } from '$app/navigation';
	import Transaction from '$lib/transactions/Transaction.svelte';
	import CreateTeller from '$lib/CreateTeller.svelte';
	import UpdateTeller from '$lib/UpdateTeller.svelte';
	import DeleteTeller from '$lib/DeleteTeller.svelte';

	type NavState =
		| 'Search'
		| 'Register'
		| 'Transaction'
		| 'Create Teller'
		| 'Update Teller'
		| 'Delete Teller';

	export let role: 'CUSTOMER' | 'ADMIN';
	let active: NavState;

	if (role === 'CUSTOMER') {
		active = 'Search';
	} else {
		active = 'Create Teller';
	}
</script>

<svelte:head>
	<title>Home</title>
	<style>
		@import url('//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css');
	</style>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
</svelte:head>

{#if role === 'ADMIN'}
	<div>
		<TabBar tabs={['Create Teller', 'Update Teller', 'Delete Teller']} let:tab bind:active>
			<Tab {tab}>
				<Label>{tab}</Label>
			</Tab>
		</TabBar>
	</div>
{:else}
	<div>
		<TabBar tabs={['Search', 'Register', 'Transaction']} let:tab bind:active>
			<Tab {tab}>
				<Label>{tab}</Label>
			</Tab>
		</TabBar>
	</div>
{/if}

{#if active === 'Search'}
	<Search />
{:else if active === 'Register'}
	<Register />
{:else if active === 'Transaction'}
	<Transaction />
{:else if active === 'Create Teller'}
	<CreateTeller />
{:else if active === 'Update Teller'}
	<UpdateTeller />
{:else}
	<DeleteTeller />
{/if}

<div
	on:click={async () => {
		await KQL_Logout.mutate();
		await KQL_Me.query({ settings: { policy: 'network-only' } });
		goto('/login');
	}}
>
	<Fab extended style="position: fixed;">
		<Icon class="material-icons">arrow_forward</Icon>
		<Label>Log Out</Label>
	</Fab>
</div>
