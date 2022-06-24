"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = __importDefault(require("./resolvers"));
const apollo_server_1 = require("apollo-server");
const subgraph_1 = require("@apollo/subgraph");
console.log('before schema');
const schema = (0, subgraph_1.buildSubgraphSchema)([
    {
        typeDefs: typeDefs_1.typeDefs,
        resolvers: resolvers_1.default,
    },
]);
console.log('built schema');
const server = new apollo_server_1.ApolloServer({
    schema,
});
console.log('after server');
(0, subgraph_1.printSubgraphSchema)(schema);
console.log('change index');
console.log('again');
server.listen({ port: 4001 }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map