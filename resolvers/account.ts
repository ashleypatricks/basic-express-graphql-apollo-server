import { dummyAccount } from '../constants';

const accountResolver = {
  Query: {
    account: async () => {
      return dummyAccount;
    },
  },
  Mutation: {
    updateAccount: async (_: any, args: any) => {
      const newObj = { ...dummyAccount, ...args.input };
      console.log(newObj);
      return newObj;
    },
  },
};

export { accountResolver };
