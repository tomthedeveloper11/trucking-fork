import { NextApiRequest, NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';

export default function userAuthenticationMiddleware() {
  return async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error('Invalid token');
      }
      jwt.verify(token, _.get(process.env, 'SECRET_KEY', ''));
      return next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

/*
USAGE
const userAuthentication = initMiddleware(
  userAuthenticationMiddleware(
  )
);

function handler() {
  ...
  await userAuthentication()
}
*/
