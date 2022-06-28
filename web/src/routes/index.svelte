<script lang="ts">
	import { setContextClient, queryStore } from '@urql/svelte';
	import client from '../_client';
	import type { HelloQuery } from '../generated/graphql';
	import { HelloDocument } from '../generated/graphql';

	setContextClient(client);

	const hello = queryStore<HelloQuery>(HelloDocument);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
