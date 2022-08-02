import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { User } from '../types/common';

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: '',
    password: '',
  } as Omit<User, 'id' | 'role'>);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function loginFunction() {
    window.event?.preventDefault();
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      data: user,
    });
    router.push('/');
    // setUser({ username: '', password: '' });
  }

  return (
    <div className="flex justify-center text-center">
      <form className="flex-col" action="post" onSubmit={loginFunction}>
        <div>
          <h1 className="text-2xl font-bold">Login to your account</h1>
        </div>
        <div className="my-3">
          <label className="block text-md mb-2">Username</label>
          <input
            className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
            type="username"
            name="username"
            placeholder="Username"
            value={user.username}
            onChange={handleChange}
          />
        </div>
        <div className="mt-5">
          <label className="block text-md mb-2">Password</label>
          <input
            className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
        </div>

        <div className="">
          <button
            className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
            type="submit"
          >
            Log in
          </button>
          {/* <div className="flex  space-x-2 justify-center items-end bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100">
            <Image
              width="20px"
              height="20px"
              className=" h-5 cursor-pointer"
              src="https://i.imgur.com/arC60SB.png"
              alt="asd"
            />
            <button>Or sign-in with google</button>
          </div> */}
        </div>
      </form>
    </div>
  );
}
