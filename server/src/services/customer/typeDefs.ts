import { gql } from 'apollo-server';

export default gql`
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
