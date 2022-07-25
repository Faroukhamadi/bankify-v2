import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Account = {
  __typename?: 'Account';
  accountNumber: Scalars['String'];
  balance: Scalars['Float'];
  createdAt: Scalars['String'];
  customer: Customer;
  deletedAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  updatedAt: Scalars['String'];
};

export type CredentialsResponse = {
  __typename?: 'CredentialsResponse';
  account?: Maybe<Account>;
  customer?: Maybe<Customer>;
  errors?: Maybe<Array<Error>>;
};

export type Customer = {
  __typename?: 'Customer';
  accounts: Array<Account>;
  cin: Scalars['String'];
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  phone: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CustomerInput = {
  cin: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phone: Scalars['String'];
};

export type CustomerResponse = {
  __typename?: 'CustomerResponse';
  customer?: Maybe<Customer>;
  errors?: Maybe<Array<FieldError>>;
};

export type Error = {
  __typename?: 'Error';
  message: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  balance: CredentialsResponse;
  createCustomer: CustomerResponse;
  deleteCustomer: Customer;
  deleteTeller: TellerResponse;
  deleteTellers: Teller;
  login: TellerResponse;
  logout: Scalars['Boolean'];
  register: TellerResponse;
  updateTeller: TellerResponse;
};


export type MutationBalanceArgs = {
  userId: Scalars['Int'];
};


export type MutationCreateCustomerArgs = {
  options: CustomerInput;
};


export type MutationDeleteCustomerArgs = {
  cin: Scalars['String'];
};


export type MutationDeleteTellerArgs = {
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationUpdateTellerArgs = {
  options: UpdateInput;
};

export type Query = {
  __typename?: 'Query';
  Teller?: Maybe<Teller>;
  Tellers: Array<Teller>;
  accounts: Array<Account>;
  balance?: Maybe<Scalars['Int']>;
  customer: CustomerResponse;
  customers: Array<Customer>;
  hello: Scalars['String'];
  me?: Maybe<Teller>;
};


export type QueryTellerArgs = {
  id: Scalars['Float'];
};


export type QueryBalanceArgs = {
  userId: Scalars['Int'];
};


export type QueryCustomerArgs = {
  cin: Scalars['String'];
};

export type Teller = {
  __typename?: 'Teller';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  role: TellerRole;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type TellerResponse = {
  __typename?: 'TellerResponse';
  errors?: Maybe<Array<FieldError>>;
  teller?: Maybe<Teller>;
};

export enum TellerRole {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER'
}

export type UpdateInput = {
  role: Scalars['String'];
  username: Scalars['String'];
};

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type CreateCustomerMutationVariables = Exact<{
  options: CustomerInput;
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'CustomerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, customer?: { __typename?: 'Customer', id: string, firstName: string, lastName: string, cin: string, phone: string } | null } };

export type DeleteTellerMutationVariables = Exact<{
  username: Scalars['String'];
}>;


export type DeleteTellerMutation = { __typename?: 'Mutation', deleteTeller: { __typename?: 'TellerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, teller?: { __typename?: 'Teller', id: string, username: string, role: TellerRole } | null } };

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'TellerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, teller?: { __typename?: 'Teller', id: string, createdAt: string, updatedAt: string, deletedAt?: string | null, username: string, role: TellerRole } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'TellerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, teller?: { __typename?: 'Teller', id: string, username: string, role: TellerRole } | null } };

export type UpdateTellerMutationVariables = Exact<{
  options: UpdateInput;
}>;


export type UpdateTellerMutation = { __typename?: 'Mutation', updateTeller: { __typename?: 'TellerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, teller?: { __typename?: 'Teller', id: string, username: string, role: TellerRole } | null } };

export type CustomerQueryVariables = Exact<{
  cin: Scalars['String'];
}>;


export type CustomerQuery = { __typename?: 'Query', customer: { __typename?: 'CustomerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, customer?: { __typename?: 'Customer', phone: string, firstName: string, lastName: string, cin: string, createdAt: string, updatedAt: string, deletedAt?: string | null, accounts: Array<{ __typename?: 'Account', id: string, balance: number, accountNumber: string }> } | null } };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Teller', id: string, username: string, role: TellerRole } | null };


export const CreateCustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CustomerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"cin"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCustomerMutation, CreateCustomerMutationVariables>;
export const DeleteTellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTeller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTellerMutation, DeleteTellerMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsernamePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const UpdateTellerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeller"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeller"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTellerMutation, UpdateTellerMutationVariables>;
export const CustomerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Customer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cin"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cin"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"customer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"cin"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"accounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"accountNumber"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CustomerQuery, CustomerQueryVariables>;
export const HelloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Hello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hello"}}]}}]} as unknown as DocumentNode<HelloQuery, HelloQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;

export const CreateCustomer = gql`
    mutation CreateCustomer($options: CustomerInput!) {
  createCustomer(options: $options) {
    errors {
      field
      message
    }
    customer {
      id
      firstName
      lastName
      cin
      phone
    }
  }
}
    `;
export const DeleteTeller = gql`
    mutation DeleteTeller($username: String!) {
  deleteTeller(username: $username) {
    errors {
      field
      message
    }
    teller {
      id
      username
      role
    }
  }
}
    `;
export const Login = gql`
    mutation Login($password: String!, $username: String!) {
  login(password: $password, username: $username) {
    errors {
      field
      message
    }
    teller {
      id
      createdAt
      updatedAt
      deletedAt
      username
      role
    }
  }
}
    `;
export const Logout = gql`
    mutation Logout {
  logout
}
    `;
export const Register = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    teller {
      id
      username
      role
    }
  }
}
    `;
export const UpdateTeller = gql`
    mutation UpdateTeller($options: UpdateInput!) {
  updateTeller(options: $options) {
    errors {
      field
      message
    }
    teller {
      id
      username
      role
    }
  }
}
    `;
export const Customer = gql`
    query Customer($cin: String!) {
  customer(cin: $cin) {
    errors {
      field
      message
    }
    customer {
      phone
      firstName
      lastName
      cin
      createdAt
      updatedAt
      deletedAt
      accounts {
        id
        balance
        accountNumber
      }
    }
  }
}
    `;
export const Hello = gql`
    query Hello {
  hello
}
    `;
export const Me = gql`
    query Me {
  me {
    id
    username
    role
  }
}
    `;