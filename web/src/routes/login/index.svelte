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
	console.log('hello');
</script>

<svelte:head>
	<title>Login</title>
	<meta name="robots" content="noindex nofollow" />
	<html lang="en" />
</svelte:head>

<div class="container">
	<Login />
</div>

<style>
	.container {
		height: 100vh;
		display: flex;
		justify-content: center;
		margin-top: 8%;
	}
</style>
