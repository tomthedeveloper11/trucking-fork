import Head from 'next/head';
import Link from 'next/link';
import { Truck } from '../types/common';
import truckBloc from '../lib/truck';
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next';
import AddTruckButton from '../components/truck/add-truck-button';
import { useContext, useEffect } from 'react';
import TruckContext from '../components/context';

export default function Home() {
  const { allTruckState, setAllTruckState } = useContext(TruckContext);
  useEffect(() => {
    const trucks = truckBloc.getTrucks();

    trucks.then((data) => {
      setAllTruckState(data);
    });
  }, []);

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
          {allTruckState.map((truck: Truck) => (
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

// export const getStaticProps = async (_context: GetStaticPropsContext) => {
//   const trucks: Truck[] = await truckBloc.getTrucks();
//   const { allTruckState, setAllTruckState } = useContext(TruckContext);
//   setAllTruckState(trucks);
//   return {
//     props: {
//       allTruckState,
//     },
//   };
// };
