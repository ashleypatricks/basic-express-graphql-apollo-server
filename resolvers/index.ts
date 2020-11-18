import { GraphQLDateTime } from 'graphql-iso-date';

import { userResolver } from './user';
import { taskResolver } from './task';
import { accountResolver } from './account';

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [
  userResolver,
  taskResolver,
  accountResolver,
  customDateScalarResolver,
];

export { resolvers };
