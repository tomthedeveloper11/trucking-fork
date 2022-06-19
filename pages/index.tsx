import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Truck } from '../types/common';
import truckBloc from '../lib/truck';
import { InferGetStaticPropsType, GetStaticPropsContext } from 'next';
import Modal from '../components/modal';

export default function Home({
  trucks,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [newTruck, setNewTruck] = useState({
    name: '',
    imageUrl: '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setNewTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruck() {
    const response = await fetch('http://localhost:3000/api/truck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...newTruck }),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container mx-auto p-5">
        {/* <DataTable<DummyData> data={dummyData} headers={headerConfig} /> */}

        <Modal
          buttonConfig={{ text: 'Tambah Truck Baru' }}
          addTruckFunction={addTruck}
          child={
            <>
              <h1 className="text-2xl">Tambah Truck Baru</h1>
              <form action="post">
                <div className="form-group m-3">
                  <label>Name: </label>
                  <input
                    className="border-2"
                    type="text"
                    value={newTruck.name}
                    name="name"
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group m-3">
                  <label>ImageURL: </label>
                  <input
                    className="border-2"
                    type="text"
                    value={newTruck.imageUrl}
                    name="imageUrl"
                    onChange={handleChange}
                  />
                </div>
              </form>
            </>
          }
        />
        <h1>My Trucks</h1>
        <div className="grid grid-cols-4 gap-4">
          {trucks.map((truck) => (
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

export const getStaticProps = async (_context: GetStaticPropsContext) => {
  const trucks: Truck[] = await truckBloc.getTrucks();
  return {
    props: {
      trucks,
    },
  };
};
