import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import userService from '../../src/user/user.service';
import initMiddleware from '../../src/middlewares/init-middleware';
import validateMiddleware from '../../src/middlewares/validate-middleware';
import { User } from '../../types/common';
import connectDb from '../../src/mongodb/connection';
import _ from 'lodash';

import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const loginValidator = initMiddleware(
  validateMiddleware(
    [
      check('username').isString().exists(),
      check('password').isString().exists(),
    ],
    validationResult
  )
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      await loginValidator(req, res);

      conn = await connectDb();
      const userPayload = req.body as User;

      const foundUser = await userService.getUser(userPayload.username);
      await conn.close();

      if (!foundUser) {
        res.status(404).json({ message: 'User not found!' });
      }

      const correctPassword = bcrypt.compareSync(
        userPayload.password,
        foundUser.password
      );

      if (!correctPassword) {
        res.status(400).json({ message: 'Incorrect Username or Password!' });
      }

      const payload = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
      };

      const access_token = jwt.sign(
        payload,
        _.get(process.env, 'SECRET_KEY', '')
      );

      res.status(200).json({
        data: {
          access_token,
        },
        message: 'Login Success!',
      });
      break;
  }
}
