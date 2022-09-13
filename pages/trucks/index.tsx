import Head from 'next/head';
import Link from 'next/link';
import { redirectToLogin, Truck } from '../../types/common';
import truckBloc from '../../lib/truck';
import { InferGetServerSidePropsType } from 'next';
import AddTruckButton from '../../components/truck/add-truck-button';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';
import { useState } from 'react';

export default function Home({
  trucks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container p-8 mt-10">
        <div className="flex justify-between mb-6">
          <form className="flex items-center">
            <div className="relative w-[20vw]">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                placeholder="Nama Truk"
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
          </form>
          {user.role === 'admin' && (
            <div className="flex mr-5 mb-3 mt-3">
              <AddTruckButton />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {trucks
            .filter((trucks) => {
              if (query === '') {
                return trucks;
              } else if (
                trucks.name.toLowerCase().includes(query.toLowerCase())
              ) {
                return trucks;
              }
            })
            .map((truck: Truck) => (
              <Link
                href={{
                  pathname: `/trucks/${truck.id}`,
                  query: {
                    truckName: truck.name,
                  },
                }}
                key={truck.id}
              >
                <a className="w-[100%] h-32 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
                  <h1 className="xl:text-5xl text-3xl text-center xl:mt-9 mt-11">
                    {truck.name}
                  </h1>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const access_token = getCookie('access_token', {
    req: context.req,
    res: context.res,
  });

  if (!access_token) return redirectToLogin;

  try {
    jwt.verify(access_token.toString(), process.env.SECRET_KEY);
  } catch (e) {
    return redirectToLogin;
  }

  const trucks: Truck[] = await truckBloc.getTrucks();

  return {
    props: {
      trucks,
    },
  };
};
