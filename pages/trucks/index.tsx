import Head from 'next/head';
import Link from 'next/link';
import { Truck } from '../../types/common';
import truckBloc from '../../lib/truck';
import { InferGetServerSidePropsType } from 'next';
import AddTruckButton from '../../components/truck/add-truck-button';

export default function Home({
  trucks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container p-10">
        <div className="flex justify-end mr-5 mb-3">
          <AddTruckButton />
        </div>
        <div className="grid grid-cols-4 gap-4 ml-17">
          {trucks.map((truck: Truck) => (
            <Link
              href={{
                pathname: `/trucks/${truck.id}`,
                query: {
                  truckName: truck.name,
                },
              }}
              key={truck.id}
            >
              <div className="w-64 h-64 border border-1 rounded hover:bg-gray-100 cursor-pointer">
                <h1 className="text-7xl text-center mt-20">{truck.name}</h1>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (_: any) => {
  const trucks: Truck[] = await truckBloc.getTrucks();
  return {
    props: {
      trucks,
    },
  };
};
