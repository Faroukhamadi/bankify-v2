<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
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
