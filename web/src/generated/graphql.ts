import type { OperationStore } from '@urql/svelte';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  Teller?: Maybe<Teller>;
  errors?: Maybe<Array<FieldError>>;
};

export enum TellerRole {
  Admin = 'ADMIN',
  Customer = 'CUSTOMER'
}

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello: string };


export const HelloDocument = gql`
    query Hello {
  hello
}
    `;
export type HelloQueryStore = OperationStore<HelloQuery, HelloQueryVariables>;