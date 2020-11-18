import { UserSchema } from '../db/models/user';

/**
 * Batch Users
 *
 * @param userIds
 */
const batchUsers = async (userIds: any) => {
  console.log('Keys====', userIds);
  const users = await UserSchema.find({ _id: { $in: userIds } });
  return userIds.map((userId: string) =>
    users.find((user: any) => user.id === userId)
  );
};

export { batchUsers };
