import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isTaskOwner } from './middleware';
import { TaskSchema } from '../db/models/task';
import { UserSchema } from '../db/models/user';
import { stringToBase64, base64ToString } from '../utils';

const taskResolver = {
  Query: {
    tasks: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, context: any) => {
        try {
          const query = { user: context.loggedInUserId } as any;

          /*
            CURSOR QUERY
            ------------

            The Cursor is a unique idenfier such as the id or creatin date of the record. Cursor based pagination works best with indexed fields and the _id field is automatically indexed.
          */
          if (args.cursor) {
            query['_id'] = {
              $lt: base64ToString(args.cursor),
            };
          }

          /*
            NEXT PAGE DETECTION
            -------------------

            We fetch ONE more record than the specified limit. So if the client sends the limit as 10, then we fetch 11 tasks from teh db.
            So if the number of record fetched is greater then the limit, then we know that we should set "hasNextPage" to true, and if not
            then we set it to false.
          */
          let tasks = await TaskSchema.find(query)
            .sort({ _id: -1 })
            .limit(args.limit + 1);

          const hasNextPage = tasks.length > args.limit;

          /*
            Remove The Extra Item Fetched
            -----------------------------

            Now that we have fetched an extra item from the db we also need to remove it - but only on a condition. If the next page exists,
            then we need to slice out the last item from the tasks array as it is an extra one that we fetched from the db which is more than the
            client's set limit.

            However, if the next page does not exist (so the task list is less than the limit), then we don't need to remove the last item since the
            result is less than the limit. So we slice or don't slice based on the result of the variable "hasNextPage".
          */
          tasks = hasNextPage ? tasks.slice(0, -1) : tasks;

          /*
            Format The Data To Be Sent To The Client
            ----------------------------------------

            The "nextPageCursor" will be the task id from the last item of the task array OR not depending on the
            "hasNextPage" value. So the client gets the "taskFeed" which is basically the tasks, and the "pageInfo"
            object literally has the "nextPageCursor" which points to the last item in the current taskFeed based on the
            limit that the client sent in, and finally the "hasNextage" value which is a boolean. NICE.
          */
          return {
            taskFeed: tasks,
            pageInfo: {
              nextPageCursor: hasNextPage
                ? stringToBase64(tasks[tasks.length - 1].id)
                : null,
              hasNextPage,
            },
          };
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
    task: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_: any, args: any) => {
        try {
          const task = await TaskSchema.findById(args.id);
          return task;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
  },
  Mutation: {
    createTask: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, context: any) => {
        try {
          const user = (await UserSchema.findOne({
            email: context.email,
          })) as any;
          const task = new TaskSchema({ ...args.input, user: user.id });
          const result = await task.save();
          user.tasks.push(result.id);
          await user.save();
          return result;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
    updateTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_: any, args: any) => {
        try {
          const task = await TaskSchema.findByIdAndUpdate(
            args.id,
            {
              ...args.input,
            },
            {
              new: true,
            } /* If you don't use this then you get the older updated record, and then you have to fetch a second time to get the latest update. Using this will give you the latest record the first time. */
          );
          return task;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
    deleteTask: combineResolvers(
      isAuthenticated,
      isTaskOwner,
      async (_: any, args: any, contextObject: any) => {
        try {
          const task = (await TaskSchema.findByIdAndDelete(args.id)) as any;
          await UserSchema.updateOne(
            { _id: contextObject.loggedInUserId },
            { $pull: { tasks: task.id } }
          );
          return task;
        } catch (e) {
          console.log(e);
          throw e;
        }
      }
    ),
  },
  Task: {
    user: async (parent: any, _: any, context: any) => {
      try {
        // The below commented out line was usually used with regular monoose but due to the n+1 problem I have used the Dataloader instead.
        // const user = await UserSchema.findById(parent.user);
        const user = await context.loaders.user.load(parent.user.toString()); // Use the toString() so the dataloaders can omit the repeated values. Parent.user will pass the objectId to the list of keys and it will not be equal to a string so its better to pass a primitive value.
        return user;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};

export { taskResolver };
