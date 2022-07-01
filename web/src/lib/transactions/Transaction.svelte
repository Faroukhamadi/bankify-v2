<script lang="ts">
	import Drawer, { AppContent, Content, Header, Title, Subtitle } from '@smui/drawer';
	import Button, { Label } from '@smui/button';
	import List, { Item, Text } from '@smui/list';
	import Withdraw from './Withdraw.svelte';
	import Deposit from './Deposit.svelte';
	import Transfer from './Transfer.svelte';

	type Transaction = 'Withdraw' | 'Deposit' | 'Transfer';

	let open = false;
	let active: Transaction = 'Withdraw';

	function setActive(value: Transaction) {
		active = value;
	}
</script>

<div class="drawer-container">
	<Drawer variant="dismissible" bind:open>
		<Header>
			<Title>Transactions</Title>
			<Subtitle>Basic Banking Operations</Subtitle>
		</Header>
		<Content>
			<List>
				<Item
					href="javascript:void(0)"
					on:click={() => setActive('Withdraw')}
					activated={active === 'Withdraw'}
				>
					<Text>Withdraw</Text>
				</Item>
				<Item
					href="javascript:void(0)"
					on:click={() => setActive('Deposit')}
					activated={active === 'Deposit'}
				>
					<Text>Deposit</Text>
				</Item>
				<Item
					href="javascript:void(0)"
					on:click={() => setActive('Transfer')}
					activated={active === 'Transfer'}
				>
					<Text>Transfer</Text>
				</Item>
			</List>
		</Content>
	</Drawer>

	<AppContent class="app-content">
		<main class="main-content">
			<Button variant="outlined" on:click={() => (open = !open)}
				><Label>Change Transaction</Label></Button
			>
			<br />
			{#if active === 'Withdraw'}
				<Withdraw />
			{:else if active === 'Deposit'}
				<Deposit />
			{:else}
				<Transfer />
			{/if}
		</main>
	</AppContent>
</div>

<style>
	.drawer-container {
		position: relative;
		display: flex;
		height: 83vh;
		z-index: 0;
		margin-bottom: 6px;
	}

	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}

	.main-content {
		overflow: auto;
		padding: 16px;
		height: 100%;
		box-sizing: border-box;
	}
</style>
