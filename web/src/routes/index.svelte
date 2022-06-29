<script lang="ts">
	import { KQL_Hello } from '$lib/graphql/_kitql/graphqlStores';
	import { browser } from '$app/env';

	$: browser && KQL_Hello.query();
</script>

{#if $KQL_Hello.isFetching}
	<h1>We are fetching still...</h1>
{/if}
<h1>{$KQL_Hello.data?.hello}</h1>

<h1 on:click={() => console.log('hello')}>click me also</h1>
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
