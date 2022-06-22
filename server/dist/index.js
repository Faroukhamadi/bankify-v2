"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const gateway_1 = require("@apollo/gateway");
const gateway = new gateway_1.ApolloGateway({
    serviceList: [{ name: 'customer', url: 'http://localhost:4001/graphql' }],
    __exposeQueryPlanExperimental: true,
});
(async () => {
    const server = new apollo_server_1.ApolloServer({
        gateway,
    });
    server.listen().then(({ url }) => {
        console.log(`server ready at ${url}`);
    });
})();
//# sourceMappingURL=index.js.map