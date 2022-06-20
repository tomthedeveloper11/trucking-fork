import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';

export default function TruckDetails({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>
      <AddTruckTransactionButton />
      <div>{'truckDetails'}</div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const truckId = context.params.id;
  return {
    props: {},
  };
};
