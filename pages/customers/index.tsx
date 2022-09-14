import Head from 'next/head';
import Link from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import customerBloc from '../../lib/customer';
import AddCustomerButton from '../../components/add-customer-button';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';
import { redirectToLogin } from '../../types/common';
import { useEffect, useState } from 'react';
import { PencilAltIcon } from '@heroicons/react/outline';

export default function Print({
  customers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();
  const [query, setQuery] = useState('');

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);

    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{'Print'}</title>
      </Head>
      <div className="container p-8">
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                placeholder="Initial Customer / Nama Customer"
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
          </form>
          {user.role === 'admin' && (
            <div className="flex justify-end mr-5 mb-3">
              <AddCustomerButton />
            </div>
          )}
        </div>

        <div
          className={`grid ${
            width > 1200 ? 'grid-cols-4' : 'grid-cols-3'
          } gap-4 ml-17`}
        >
          {Object.values(customers)
            .filter((customer) => {
              if (query === '') {
                return customer;
              } else if (
                customer.initial.toLowerCase().includes(query.toLowerCase()) ||
                customer.name?.toLowerCase().includes(query.toLowerCase())
              ) {
                return customer;
              }
            })
            .map((customer) => (
              <div
                className="flex bg-white rounded border border-gray-200 shadow-md"
                key={customer.id}
              >
                <div className="hover:bg-gray-100 flex-grow cursor-pointer">
                  <Link
                    href={{
                      pathname: `/customers/${customer.id}`,
                    }}
                    key={customer.id}
                  >
                    <h1
                      className={`${
                        customer.initial.length > 13 ? 'text-2xl' : 'text-3xl'
                      } xl:text-5xl text-center my-8`}
                    >
                      {customer.initial}
                    </h1>
                  </Link>
                </div>

                {user.role === 'admin' && (
                  <div className="border-l-2 flex">
                    <PencilAltIcon
                      className="text-yellow-200 hover:text-yellow-300 cursor-pointer h-7 z-10 self-center"
                      onClick={() => {
                        console.log('edit');
                      }}
                    />
                  </div>
                )}
              </div>
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

  const customers = await customerBloc.getCustomers();

  return {
    props: {
      customers,
    },
  };
};
