import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, type ApolloQueryResult } from '@apollo/client/core';

const cache = new InMemoryCache();

export default new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache
});
