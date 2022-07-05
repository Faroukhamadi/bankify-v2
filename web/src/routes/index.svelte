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
				status: 302
			};
		}
		return {};
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

	type NavState = 'Search' | 'Register' | 'Transaction';

	let active: NavState = 'Search';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
</svelte:head>

<div>
	<TabBar tabs={['Search', 'Register', 'Transaction']} let:tab bind:active>
		<Tab {tab}>
			<Label>{tab}</Label>
		</Tab>
	</TabBar>
</div>

{#if active === 'Search'}
	<Search />
{:else if active === 'Register'}
	<Register />
{:else}
	<Transaction />
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
