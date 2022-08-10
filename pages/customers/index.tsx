import Head from 'next/head';
import Link from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import customerBloc from '../../lib/customer';
import AddCustomerButton from '../../components/add-customer-button';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';

export default function Print({
  customers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  return (
    <>
      <Head>
        <title>{'Print'}</title>
      </Head>
      <div className="container p-8">
        {user?.role !== 'guest' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddCustomerButton />
          </div>
        )}
        <div className="grid grid-cols-4 gap-4 ml-17">
          {Object.values(customers).map((customer) => (
            <Link
              href={{
                pathname: `/customers/${customer.id}`,
              }}
              key={customer.id}
            >
              <div className="xl:w-64 xl:h-64 w-40 h-40 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 cursor-pointer">
                <h1 className="xl:text-7xl text-5xl text-center xl:mt-20 mt-[52px]">
                  {customer.initial}
                </h1>
              </div>
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
  }) as string;

  try {
    jwt.verify(access_token, process.env.SECRET_KEY);
  } catch (e) {
    return {
      redirect: {
        permanent: false,
        destination: `/login`,
      },
    };
  }

  const customers = await customerBloc.getCustomers();
  return {
    props: {
      customers,
    },
  };
};
