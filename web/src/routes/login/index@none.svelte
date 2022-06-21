<script lang="ts">
	import Textfield from '@smui/textfield';
	import Button from '@smui/button';
	let emailValue = '';
	let passwordValue = '';
</script>

<main>
	<h1>Bankify</h1>
	<h2>Sign in</h2>

	<div>
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={emailValue}
			label="Email Address"
			required
		/>
		<Textfield
			style="min-width: 30rem;"
			variant="outlined"
			bind:value={passwordValue}
			label="Filled"
			required
		/>
		<Button style="min-width: 30rem;" variant="raised">SIGN IN</Button>
	</div>
</main>

<style>
	h2 {
		font-family: 'Roboto';
		font-weight: 400;
		text-align: center;
	}
	h1 {
		font-family: 'Roboto';
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
		color: #676778;
	}
	div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 30px;
	}
</style>
