"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
exports.default = (0, apollo_server_1.gql) `
	type Customer @key(fields: "id") {
		id: ID!
		createdAt: String
		updatedAt: String
		deletedAt: String
		firstName: String
		lastName: String
		cin: String
		phone: String
	}

	extend type Query {
		me: Customer
	}
`;
//# sourceMappingURL=typeDefs.js.map