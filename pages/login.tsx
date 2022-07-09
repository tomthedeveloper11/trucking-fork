import Image from 'next/image';
import React from 'react';

function login() {
  return (
    <div className="min-h-screen bg-no-repeat bg-cover bg-center flex">
      <Image
        src="https://i.imgur.com/bjFhW6N.jpeg"
        width={1050}
        height={550}
        alt="asd"
      ></Image>
      <div className="flex justify-end">
        <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
          <div>
            <form>
              <div>
                <span className="text-sm text-gray-900">Welcome back</span>
                <h1 className="text-2xl font-bold">Login to your account</h1>
              </div>
              <div className="mt-5">
                <label className="block text-md mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="password"
                  name="password"
                  placeholder="password"
                />
              </div>
              <div className="my-3">
                <label className="block text-md mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                  type="email"
                  name="password"
                  placeholder="email"
                />
              </div>
              <div className="flex justify-between">
                <div>
                  <input
                    className="cursor-pointer"
                    type="radio"
                    name="rememberme"
                  />
                  <span className="text-sm">Remember Me</span>
                </div>
                <span className="text-sm text-blue-700 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="">
                <button className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100">
                  Login now
                </button>
                <div className="flex  space-x-2 justify-center items-end bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100">
                  <Image
                    width="20px"
                    height="20px"
                    className=" h-5 cursor-pointer"
                    src="https://i.imgur.com/arC60SB.png"
                    alt="asd"
                  />
                  <button>Or sign-in with google</button>
                </div>
              </div>
            </form>
            <p className="mt-8">
              {' '}
              Dont have an account?{' '}
              <span className="cursor-pointer text-sm text-blue-600">
                {' '}
                Join free today
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;
