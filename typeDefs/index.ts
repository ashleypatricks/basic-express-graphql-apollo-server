import { gql } from 'apollo-server-express';

import { userTypeDefs } from './user';
import { taskTypeDefs } from './task';
import { accountTypeDefs } from './account';

const typeDefs = gql`
  scalar Date

  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type Subscription {
    _: String
  }
`;

const rootTypeDefs = [typeDefs, userTypeDefs, taskTypeDefs, accountTypeDefs];

export { rootTypeDefs };
