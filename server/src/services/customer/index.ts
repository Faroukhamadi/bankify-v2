import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { ApolloServer } from 'apollo-server';
// import { buildFederatedSchema } from '@apollo/subgraph/dist/buildSubgraphSchema';
import { buildSubgraphSchema } from '@apollo/subgraph';

const main = async () => {
	console.log('hello world is much cooler than servers');

	// const server = new ApolloServer({
	// 	schema: buildSubgraphSchema([
	// 		{
	// 			typeDefs,
	// 			resolvers,
	// 		},
	// 	]),
	// });

	// server.listen({ port: 4001 }).then(({ url }) => {
	// 	console.log(`Server ready at ${url}`);
	// });
};

main().catch((err) => console.log(err));
