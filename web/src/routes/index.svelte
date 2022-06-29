<script lang="ts">
	import Search from '$lib/Search.svelte';
	import Register from '$lib/Register.svelte';
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	type NavState = 'Search' | 'Register';

	let active: NavState = 'Search';
</script>

<div>
	<TabBar tabs={['Search', 'Register']} let:tab bind:active>
		<Tab {tab}>
			<Label>{tab}</Label>
		</Tab>
	</TabBar>
</div>

{#if active === 'Search'}
	<Search />
{:else}
	<Register />
{/if}
