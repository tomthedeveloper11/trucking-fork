import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';
import truckTransactionBloc from '../../lib/truckTransactions';
import { TruckTransaction } from '../../types/common';
import DataTable from '../../components/data-table';
import { Button } from 'flowbite-react';
import { useToastContext } from '../../lib/toast-context';

export default function TruckDetails({
  truckId,
  truckTransactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const addToast = useToastContext();

  const dataTableHeaders = {
    Tanggal: 'w-1/12',
    'No. Container': 'w-2/12',
    'No. Bon': 'w-1/12',
    Tujuan: 'w-2/12',
    Borongan: 'w-1/12',
    Pembayaran: 'w-1/12',
    EMKL: 'w-1/12',
    'Info Tambahan': 'w-3/12',
  };
  const formatTruckTransaction = (
    truckTransaction: TruckTransaction
  ): Omit<TruckTransaction, 'transactionType' | 'truckId' | 'id'> => {
    return {
      date: new Date(truckTransaction.date).toLocaleDateString(),
      containerNo: truckTransaction.containerNo,
      invoiceNo: truckTransaction.invoiceNo,
      destination: truckTransaction.destination,
      cost: truckTransaction.cost,
      sellingPrice: truckTransaction.sellingPrice,
      customer: truckTransaction.customer,
      details: truckTransaction.details,
    };
  };
  function toast() {
    addToast('asd');
  }

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="px-32 py-14 w-">
        <div className="my-4">
          <Button onClick={toast}>hello</Button>
          <AddTruckTransactionButton truckId={truckId} />
        </div>
        <DataTable
          headers={dataTableHeaders}
          data={truckTransactions.map((t) => formatTruckTransaction(t))}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const truckId: string = context.params.id;
  const truckTransactions = await truckTransactionBloc.getTruckTransactions(
    truckId
  );
  return {
    props: { truckId, truckTransactions },
  };
};
