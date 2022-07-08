<script context="module" lang="ts">
	import { KQL_Customer } from '$lib/graphql/_kitql/graphqlStores';
	import { get } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import type { RequestResult } from '@kitql/client';
	import type { CustomerQuery, Exact } from '$lib/graphql/_kitql/graphqlTypes';

	export const load: Load = async ({ params, fetch }) => {
		// @ts-ignore
		await KQL_Customer.queryLoad({ variables: { cin: params.cin }, fetch });
		const res = get(KQL_Customer);
		const accountId = res.data?.customer.customer?.accounts[0].id;

		// later check if this customer even has transactions
		const data = await fetch(
			`http://localhost:4001/transactions/${accountId}?${new URLSearchParams({
				page: '1',
				limit: '10'
			})}`
		);

		const transactionCount = await fetch(`http://localhost:4001/transactions/count/${accountId}`);

		return {
			status: 200,
			props: {
				res,
				data: await data.json(),
				transactionCount: await transactionCount.json()
			}
		};
	};
</script>

<script lang="ts">
	import List, { Item, Text, PrimaryText, SecondaryText } from '@smui/list';
	import Button from '@smui/button/src/Button.svelte';
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import { Icon, Label } from '@smui/button';
	import type { Transaction } from '../../../../server/src/entities/Transaction';

	export let data: PaginatedData;
	export let transactionCount: {
		count: number;
	};
	export let res: RequestResult<
		CustomerQuery,
		Exact<{
			cin: string;
		}>
	>;

	let currentPage = 1;
	let start = 1;
	let end = 10;
	let loadingNext = false;
	let loadingPrev = false;
	let transactionsLeft: number = transactionCount.count;

	interface PrevOrNext {
		page: number;
		limit: number;
	}
	interface PaginatedData {
		results: Array<Transaction>;
		next?: PrevOrNext;
		prev?: PrevOrNext;
	}
</script>

<h1>Customer Information</h1>
<div>
	<List twoLine nonInteractive>
		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">First Name</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{res.data?.customer.customer?.firstName}</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Last Name</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{res.data?.customer.customer?.lastName}</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">CIN</PrimaryText>
				<SecondaryText style="font-size: large;">{res.data?.customer.customer?.cin}</SecondaryText>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Phone</PrimaryText>
				<SecondaryText style="font-size: large;">{res.data?.customer.customer?.phone}</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Balance</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{res.data?.customer.customer?.accounts[0].balance} D.T</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Account Number</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{res.data?.customer.customer?.accounts[0].accountNumber}</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Created At</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{new Date(
						parseInt(res.data?.customer.customer?.createdAt ?? '')
					).toLocaleDateString()}</SecondaryText
				>
			</Text>
		</Item>

		<Item>
			<Text>
				<PrimaryText style="font-size: x-large;">Updated At</PrimaryText>
				<SecondaryText style="font-size: large;"
					>{new Date(
						parseInt(res.data?.customer.customer?.updatedAt ?? '')
					).toLocaleDateString()}</SecondaryText
				>
			</Text>
		</Item>
	</List>
	<h2>Customer Transactions</h2>
	<DataTable table$aria-label="Todo list" style="width: 100%;">
		<Head>
			<Row>
				<Cell>ID</Cell>
				<Cell>Amount</Cell>
				<Cell>Type</Cell>
				<Cell>Transaction Date</Cell>
				<Cell numeric>Customer CIN</Cell>
				<Cell numeric>Sender CIN</Cell>
				<Cell numeric>Receiver CIN</Cell>
			</Row>
		</Head>
		<Body>
			{#each data.results as transaction (transaction.id)}
				<Row>
					<Cell>{transaction.id}</Cell>
					<Cell>{transaction.amount + ' D.T'}</Cell>
					{#if transaction.id[0] === 'd'}
						<Cell>Deposit</Cell>
					{:else if transaction.id[0] === 'w'}
						<Cell>Withdraw</Cell>
					{:else}
						<Cell>Transfer</Cell>
					{/if}
					<Cell>{new Date(transaction.createdAt.toString()).toLocaleDateString()}</Cell>
					<Cell numeric>{transaction?.customerAccount?.customer.cin ?? 'None'}</Cell>
					<Cell numeric>{transaction.senderAccount?.customer.cin ?? 'None'}</Cell>
					<Cell numeric>{transaction.receiverAccount?.customer.cin ?? 'None'}</Cell>
				</Row>
			{/each}
		</Body>

		<Pagination slot="paginate">
			<svelte:fragment slot="total">
				{start} - {end} of {transactionCount.count}
			</svelte:fragment>

			<IconButton
				class="material-icons"
				action="prev-page"
				title="Prev page"
				on:click={async () => {
					currentPage--;
					loadingPrev = true;
					let response = await fetch(
						`http://localhost:4001/transactions/${
							res.data?.customer.customer?.accounts[0].id
						}?${new URLSearchParams({
							page: currentPage.toString(),
							limit: '10'
						})}`
					);

					data = await response.json();
					transactionsLeft += 10;
					start -= 10;
					if (end == transactionCount.count) {
						end -= end % 10;
					} else {
						end -= 10;
					}

					loadingPrev = false;
				}}
				disabled={currentPage === 1 || loadingPrev}>chevron_left</IconButton
			>
			<IconButton
				class="material-icons"
				action="next-page"
				title="Next page"
				on:click={async () => {
					currentPage++;
					loadingNext = true;
					let response = await fetch(
						`http://localhost:4001/transactions/${
							res.data?.customer.customer?.accounts[0].id
						}?${new URLSearchParams({
							page: currentPage.toString(),
							limit: '10'
						})}`
					);
					data = await response.json();

					transactionsLeft -= 10;
					start += 10;

					if (end + 10 <= transactionCount.count) {
						end += 10;
					} else {
						end = transactionCount.count;
					}

					loadingNext = false;
				}}
				disabled={transactionsLeft <= 10 || loadingNext}>chevron_right</IconButton
			>
		</Pagination>
	</DataTable>
	<a sveltekit:prefetch href="/">
		<Button variant="raised">
			<Icon class="material-icons">arrow_backward</Icon>
			<Label>HOME</Label>
		</Button>
	</a>
</div>

<style>
	h1 {
		font-family: 'Roboto';
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
		color: #676778;
	}
	h2 {
		font-family: 'Roboto';
		color: #676778;
	}
	a {
		text-decoration: none;
	}
	* {
		cursor: default;
	}
</style>
