import { GraphQLDateTime } from 'graphql-iso-date';

import { userResolver } from './user';
import { taskResolver } from './task';

const customDateScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = [userResolver, taskResolver, customDateScalarResolver];

export { resolvers };
