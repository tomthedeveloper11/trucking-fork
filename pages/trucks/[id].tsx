import Head from 'next/head';
import {
  GetStaticPropsContext,
  GetStaticPathsResult,
  InferGetStaticPropsType,
} from 'next';
import { Truck } from '../../types/common';
import truckBloc from '../../lib/truck';
import Modal from '../../components/modal';

export default function TruckDetails({
  truckDetails,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>
      <div>{truckDetails}</div>
    </>
  );
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const trucks: Truck[] = await truckBloc.getTrucks();
  return {
    paths: trucks.map((truck) => ({ params: { id: truck.id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const truckDetails = 'FUCK U ' + params?.id;
  return {
    props: {
      truckDetails,
    },
  };
}
