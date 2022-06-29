<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { KQL_Me } from '$lib/graphql/_kitql/graphqlStores';
	import { get } from 'svelte/store';

	export const load: Load = async ({ fetch }) => {
		// @ts-ignore
		await KQL_Me.queryLoad({ fetch });
		const res = get(KQL_Me);
		if (res.data?.me) {
			return {
				redirect: '/',
				status: 302
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import Login from '$lib/Login.svelte';
	import About from '$lib/About.svelte';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	type NavState = 'Login' | 'About';

	let active: NavState = 'Login';
</script>

<div>
	<TabBar tabs={['Login', 'About']} let:tab bind:active>
		<Tab {tab}>
			<Label>{tab}</Label>
		</Tab>
	</TabBar>
</div>

{#if active === 'Login'}
	<Login />
{:else}
	<About />
{/if}

<style>
</style>
