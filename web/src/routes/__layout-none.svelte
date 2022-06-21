<script lang="ts">
	import Tab, { Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	// import Button from '@smui/button';

	let active = 'Login';
	$: console.log('active: ', active);
</script>

<div>
	<TabBar tabs={['Login', 'About']} let:tab bind:active>
		<Tab {tab}>
			<Label>{tab}</Label>
		</Tab>
	</TabBar>
</div>

<slot />
