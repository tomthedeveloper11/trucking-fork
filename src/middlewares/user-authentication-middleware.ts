import { NextApiRequest, NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import _ from 'lodash';
import userService from '../user/user.service';

export default function userAuthenticationMiddleware() {
  return async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    try {
      console.log(req.headers, '<<<req');
      // console.log(res, '<<<res');
      // const access_token = req.headers.authorization;
      // console.log(
      //   '🚀 ~ file: user-authentication-middleware.ts ~ line 10 ~ return ~ access_token',
      //   access_token
      // );
      // if (!access_token) {
      //   throw new Error('Invalid token');
      // }
      // const payload = jwt.verify(
      //   access_token,
      //   _.get(process.env, 'SECRET_KEY', '')
      // );
      // console.log(
      //   '🚀 ~ file: user-authentication-middleware.ts ~ line 17 ~ return ~ payload',
      //   payload
      // );

      // const currentUser = await userService.getUser(payload.username);

      // if (!currentUser) {
      //   throw new Error('User tidak ada atau password salah');
      // } else {
      //   req.currentUser = {
      //     id: currentUser.id,
      //     role: currentUser.role,
      //     username: currentUser.username,
      //   };
      // }
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
