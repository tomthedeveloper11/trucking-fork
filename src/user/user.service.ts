import { User } from '../../types/common';
import userRepository from './user.repository';

const createUser = async (userPayload: Omit<User, 'id'>) => {
  const newUser = await userRepository.createUser(userPayload);
  return newUser;
};

const getUser = async (username: string) => {
  const user = await userRepository.getUser(username);
  return user;
};

const userService = {
  createUser,
  getUser,
};

export default userService;
