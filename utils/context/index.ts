import { verify } from 'jsonwebtoken';
import dotEnv from 'dotenv';

import { UserSchema } from '../../db/models/user';

dotEnv.config();

const verifyUser = async (req: any) => {
  try {
    req.email = null;
    req.loggedInUserId = null;

    const bearerHeader = req.headers.authorization;

    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload = verify(
        token,
        process.env.JWT_SECRET_KEY || 'mysecretkey'
      ) as any;

      req.email = payload.email;
      const user = (await UserSchema.findOne({ email: payload.email })) as any;
      req.loggedInUserId = user.id;
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export { verifyUser };
