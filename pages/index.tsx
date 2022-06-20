import Head from 'next/head';
import Link from 'next/link';
import { Truck } from '../types/common';
import truckBloc from '../lib/truck';
import { InferGetServerSidePropsType } from 'next';
import AddTruckButton from '../components/truck/add-truck-button';

export default function Home({
  trucks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container mx-auto p-5">
        {/* <DataTable<DummyData> data={dummyData} headers={headerConfig} /> */}

        <AddTruckButton />
        <h1>My Trucks</h1>
        <div className="grid grid-cols-4 gap-4">
          {trucks.map((truck: Truck) => (
            <Link href={`/trucks/${truck.id}`} key={truck.id}>
              <div className="border border-1 rounded p-2 hover:bg-gray-100 cursor-pointer">
                {truck.name}
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
