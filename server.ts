import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotEnv from 'dotenv';
import Dataloader from 'dataloader';

import { resolvers } from './resolvers';
import { rootTypeDefs } from './typeDefs';
import { connection } from './db/util';
import { verifyUser } from './utils/context';
import { batchUsers } from './loaders';

// Env variables
dotEnv.config();
const { PORT, path } = process.env;

// Setup Express
const app = express();
app.use(cors());
app.use(express.json());

// DB Connectivity
connection();

// Apollo Server Setup
/*
  The context() function receives the req and res objects in terms of handling Queries and Mutations.
  But in terms of Subscriptions, it receives a connection object for web sockets.
*/
const apolloServer = new ApolloServer({
  typeDefs: rootTypeDefs,
  resolvers: resolvers as any,
  context: async (contextObject: any) => {
    let contextObj = {
      email: '',
      loggedInUserId: '',
      loaders: {},
    };

    if (contextObject.req) {
      await verifyUser(contextObject.req);
      contextObj.email = contextObject.req.email;
      contextObj.loggedInUserId = contextObject.req.loggedInUserId;
    }

    contextObj.loaders = {
      user: new Dataloader(keys => batchUsers(keys)),
    };

    return contextObj;
  },
  formatError: error => {
    console.log(error);
    return error;
  },
});

apolloServer.applyMiddleware({ app, path });

app.use('/', (req, res, next) => {
  res.send({ message: 'Online!' });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`);
  console.log(`GraphQL Endpoint: ${apolloServer.graphqlPath}`);
});

apolloServer.installSubscriptionHandlers(httpServer);
