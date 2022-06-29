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
  accountNumber: Scalars['String'];
  balance: Scalars['Float'];
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

export type FindCustomerInput = {
  cin: Scalars['String'];
  id: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: CredentialsResponse;
  createCustomer: CustomerResponse;
  deleteTeller: Teller;
  deleteTellers: Teller;
  login: TellerResponse;
  logout: Scalars['Boolean'];
  register: TellerResponse;
};


export type MutationCreateAccountArgs = {
  userId: Scalars['Int'];
};


export type MutationCreateCustomerArgs = {
  options: CustomerInput;
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

export type Query = {
  __typename?: 'Query';
  Teller?: Maybe<Teller>;
  Tellers: Array<Teller>;
  accounts: Array<Account>;
  balance?: Maybe<Scalars['Int']>;
  customer: Customer;
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
  options: FindCustomerInput;
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

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'TellerResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, teller?: { __typename?: 'Teller', id: string, createdAt: string, updatedAt: string, deletedAt?: string | null, username: string, role: TellerRole } | null } };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Teller', id: string, createdAt: string, updatedAt: string, deletedAt?: string | null, username: string, role: TellerRole } | null };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"field"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teller"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const HelloDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Hello"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hello"}}]}}]} as unknown as DocumentNode<HelloQuery, HelloQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;

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
export const Hello = gql`
    query Hello {
  hello
}
    `;
export const Me = gql`
    query Me {
  me {
    id
    createdAt
    updatedAt
    deletedAt
    username
    role
  }
}
    `;