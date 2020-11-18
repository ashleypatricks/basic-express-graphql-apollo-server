import { gql } from 'apollo-server-express';

const accountTypeDefs = gql`
  extend type Query {
    account(iban: String): Account!
  }

  extend type Mutation {
    updateAccount(input: updateAccountInput!): Account!
  }

  type Account {
    iban: String!
    currency: String!
    status: String!
    display_name: String!
    balance: Int!
    daily_limit: Int!
  }

  input updateAccountInput {
    display_name: String
    daily_limit: Int
  }
`;

export { accountTypeDefs };
