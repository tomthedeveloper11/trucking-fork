import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';
import AddAdditionalTransactionButton from '../../components/truck/add-additional-transaction-button';
import truckTransactionBloc from '../../lib/truckTransactions';
import {
  DataTableTruckTransaction,
  DataTableAdditionalTransaction,
  TruckTransaction,
  AdditionalTruckTransaction,
} from '../../types/common';
import TruckTransactionDataTable from '../../components/truck-transaction-data-table';
import TransactionDataTable from '../../components/transaction-data-table';
import { useState } from 'react';

export default function TruckDetails({
  truckName,
  truckId,
  truckTransactions,
  miscTruckTransactions,
  autoCompleteData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const truckDataTableHeaders = {
    Tanggal: 'w-1/12',
    'No. Container': 'w-2/12',
    'No. Bon': 'w-1/12',
    Tujuan: 'w-2/12',
    Borongan: 'w-1/12',
    Pembayaran: 'w-1/12',
    EMKL: 'w-1/12',
    'Info Tambahan': 'w-3/12',
  };

  const miscDataTableHeaders = {
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTruckTransaction = (
    truckTransaction: TruckTransaction
  ): DataTableTruckTransaction => {
    return {
      id: truckTransaction.id,
      date: new Date(truckTransaction.date).toLocaleDateString('id-ID'),
      containerNo: truckTransaction.containerNo,
      invoiceNo: truckTransaction.invoiceNo,
      destination: truckTransaction.destination,
      cost: truckTransaction.cost,
      sellingPrice: truckTransaction.sellingPrice,
      customer: truckTransaction.customer,
      details: truckTransaction.details,
      isPrinted: truckTransaction.isPrinted,
      truckId: truckTransaction.truckId,
    };
  };

  const formatMiscTransaction = (
    transaction: AdditionalTruckTransaction
  ): DataTableAdditionalTransaction => {
    return {
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
      isPrinted: transaction.isPrinted,
      truckId: transaction.truckId,
    };
  };

  const [table, setTable] = useState('trip');
  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-10 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">{truckName}</h1>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setTable('trip')}
        >
          Pengeluaran Trip
        </button>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => setTable('misc')}
        >
          Pengeluaran Lainnya
        </button>
        <button></button>
        <div className="flex justify-end mr-5 mb-3">
          <AddTruckTransactionButton
            truckId={truckId}
            autoCompleteData={autoCompleteData}
          />
        </div>
        <div className="flex justify-end mr-5 mb-3">
          <AddAdditionalTransactionButton truckId={truckId} />
        </div>
        {table === 'trip' ? (
          <TruckTransactionDataTable
            headers={truckDataTableHeaders}
            data={truckTransactions.map((t) => formatTruckTransaction(t))}
            hiddenFields={['id', 'isPrinted', 'truckId']}
            autoCompleteData={autoCompleteData}
          />
        ) : (
          <TransactionDataTable
            headers={miscDataTableHeaders}
            data={miscTruckTransactions.map((t) => formatMiscTransaction(t))}
            hiddenFields={['id', 'isPrinted', 'truckId']}
          />
        )}
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const truckId: string = context.params.id;
  const truckName: string = context.query.truckName;
  const truckTransactions =
    await truckTransactionBloc.getTruckTransactionsByTruckId(truckId);
  const miscTruckTransactions =
    await truckTransactionBloc.getMiscTruckTransactionsByTruckId(truckId);
  const autoCompleteData =
    await truckTransactionBloc.getTruckTransactionAutoComplete();
  return {
    props: {
      truckName,
      truckId,
      truckTransactions,
      miscTruckTransactions,
      autoCompleteData,
    },
  };
};
