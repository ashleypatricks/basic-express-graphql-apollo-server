import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import dotEnv from 'dotenv';

import { UserSchema } from '../db/models/user';
import { TaskSchema } from '../db/models/task';
import { isAuthenticated } from './middleware';
import { pubSub } from '../subscription';
import { userEvents } from '../subscription/events';

dotEnv.config();

const { JWT_SECRET_KEY } = process.env || 'mysecretkey';

const userResolver = {
  Query: {
    user: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, context: any) => {
        try {
          const user = await UserSchema.findOne({ email: context.email });
          if (!user) {
            throw new Error('User not found!');
          }
          return user;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
  },
  Mutation: {
    signup: async (_: any, args: any) => {
      try {
        const user = await UserSchema.findOne({ email: args.input.email });

        if (user) throw new Error('Email already in use!');

        const hashedPassword = await hash(args.input.password, 12);
        const newUser = new UserSchema({
          ...args.input,
          password: hashedPassword,
        });
        const result = await newUser.save();
        pubSub.publish(userEvents.USER_CREATED, { userCreated: result });
        return result;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    login: async (_: any, args: any) => {
      try {
        const user = await UserSchema.findOne({
          email: args.input.email,
        });

        if (!user) throw new Error('User not found');

        const isPasswordValid = await compare(
          args.input.password,
          // @ts-ignore
          user.password
        );
        if (!isPasswordValid) throw new Error('Incorrect password');

        // @ts-ignore
        const token = sign({ email: user.email }, JWT_SECRET_KEY, {
          expiresIn: '1d',
        });

        return { token };
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubSub.asyncIterator(userEvents.USER_CREATED),
    },
  },
  User: {
    tasks: async (parent: any) => {
      try {
        const tasks = await TaskSchema.find({ user: parent.id });
        return tasks;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};

export { userResolver };
