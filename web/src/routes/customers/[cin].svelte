<script context="module" lang="ts">
	import { KQL_Customer } from '$lib/graphql/_kitql/graphqlStores';
	import { get } from 'svelte/store';
	import type { Load } from '@sveltejs/kit';
	import type { RequestResult } from '@kitql/client';
	import type { CustomerQuery, Exact } from '$lib/graphql/_kitql/graphqlTypes';

	export const load: Load = async ({ params }) => {
		await KQL_Customer.queryLoad({ variables: { cin: params.cin }, fetch });
		return {
			status: 200,
			props: {
				res: get(KQL_Customer)
			}
		};
	};
</script>

<script lang="ts">
	import { Customer } from '$lib/graphql/_kitql/graphqlTypes';
	import List, { Item, Text, PrimaryText, SecondaryText } from '@smui/list';
	import { dataset_dev } from 'svelte/internal';

	export let res: RequestResult<
		CustomerQuery,
		Exact<{
			cin: string;
		}>
	>;

	console.log(new Date(parseInt(res.data!.customer.customer!.createdAt)).toLocaleDateString());
</script>

<h1>Customer Information:</h1>
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
</div>

<style>
	h1 {
		font-family: 'Roboto';
		font-weight: 900;
		font-size: 3rem;
		text-align: center;
		color: #676778;
	}
</style>
