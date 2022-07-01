import Head from 'next/head';
import Link from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import AddTruckButton from '../../components/truck/add-truck-button';
import customerBloc from '../../lib/customer';

export default function Print({
  customers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{'Print'}</title>
      </Head>
      <div className="container p-10">
        <div className="flex justify-end mr-5 mb-3">
          <AddTruckButton />
        </div>
        <div className="grid grid-cols-4 gap-4 ml-17">
          {Object.values(customers).map((customer) => (
            <Link
              href={{
                pathname: `/customers/${customer.id}`,
              }}
              key={customer.id}
            >
              <div className="w-64 h-64 border border-1 rounded hover:bg-gray-100 cursor-pointer">
                <h1 className="text-7xl text-center mt-20">
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

export const getServerSideProps = async (_: any) => {
  const customers = await customerBloc.getCustomers();
  return {
    props: {
      customers,
    },
  };
};
