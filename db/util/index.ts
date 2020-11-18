import { Types, connect, set } from 'mongoose';
import dotEnv from 'dotenv';

dotEnv.config();
const { MONGO_DB_URL } = process.env;

/**
 * Connection
 */
const connection = async () => {
  try {
    set('debug', true); // Prints out all of the db queries to the console. We can therefore track all of the db hits that is performed by mongoose.

    await connect(MONGO_DB_URL as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('DB Connected Successfully');
  } catch (e) {
    console.log('Mongoose Connection Error:');
    console.log(e);
    throw e;
  }
};

/**
 * Is Valid Object
 *
 * @param objectId
 */
const isValidObjectId = (id: any) => {
  return Types.ObjectId.isValid(id);
};

export { connection, isValidObjectId };
