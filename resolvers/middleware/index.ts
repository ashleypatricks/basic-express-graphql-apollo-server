import { skip } from 'graphql-resolvers';

import { TaskSchema } from '../../db/models/task';
import { isValidObjectId } from '../../db/util';

/**
 * Is Authenticated
 * @param parent
 * @param args
 * @param param2
 */
const isAuthenticated = (parent: any, args: any, { email }: any) => {
  if (!email) {
    throw new Error('Access Denied! Please login to continue');
  }
  return skip;
};

/**
 * Is Task Owner
 * @param parent
 * @param args
 */
const isTaskOwner = async (parent: any, args: any, contextOb: any) => {
  try {
    if (!isValidObjectId(args.id)) {
      throw new Error('Invalid Task id');
    }
    const task = (await TaskSchema.findById(args.id)) as any;

    if (!task) {
      throw new Error('Task not found!');
    } else if (task.user.toString() !== contextOb.loggedInUserId) {
      throw new Error('Not authorised as task owner');
    }

    return skip;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export { isAuthenticated, isTaskOwner };
