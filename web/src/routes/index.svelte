<script lang="ts">
	import { setClient, query } from 'svelte-apollo';
	import { ApolloClient } from '@apollo/client/core';
	import { InMemoryCache } from '@apollo/client/cache';
	import { HelloDocument, type HelloQuery } from '../generated/graphql';

	const cache = new InMemoryCache();

	const client = new ApolloClient({
		uri: 'http://localhost:4000/graphql',
		cache
	});

	setClient(client);

	const hello = query(HelloDocument);
</script>

{#if $hello.loading}
	<h1>Loading...</h1>
{:else if $hello.error}
	<h1>Error: {$hello.error.message}</h1>
{:else}
	<h1>{$hello.data}</h1>
{/if}

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
