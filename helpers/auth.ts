import { deleteCookie, getCookie } from 'cookies-next';
import * as jwt from 'jsonwebtoken';
import { UserTokenPayload } from '../types/common';

const authorizeUser = () => {
  const access_token = getCookie('access_token');
  if (!access_token) {
    throw new Error('Access Token required');
  }
  const user = jwt.verify(
    access_token.toString(),
    'secret123'
  ) as UserTokenPayload;
  return user;
};

export default authorizeUser;
