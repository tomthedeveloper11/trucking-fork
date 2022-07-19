import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';
import AddAdditionalTruckTransactionButton from '../../components/truck/add-additional-truck-transaction-button';
import truckTransactionBloc from '../../lib/truckTransaction';
import {
  DataTableTruckTransaction,
  DataTableAdditionalTransaction,
  TruckTransaction,
  AdditionalTruckTransaction,
} from '../../types/common';
import TruckTransactionDataTable from '../../components/truck-transaction-data-table';
import AdditionalTruckTransactionDataTable from '../../components/additional-truck-transaction-data-table';
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
    bon: 'w-1/12',
    'Info Tambahan': 'w-2/12',
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
      bon: truckTransaction.bon,
      details: truckTransaction.details,
      truckId: truckTransaction.truckId,
      isPrintedBon: truckTransaction.isPrintedBon,
      isPrintedInvoice: truckTransaction.isPrintedInvoice,
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
      truckId: transaction.truckId,
    };
  };

  const [table, setTable] = useState('trip');
  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">{truckName}</h1>
        <button
          className={`mr-3 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ${
            table === 'trip'
              ? 'bg-blue-500 text-white'
              : 'bg-transparent text-blue-700'
          }`}
          onClick={() => setTable('trip')}
        >
          Transaksi Trip
        </button>
        <button
          className={`mr-3 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ${
            table === 'misc'
              ? 'bg-blue-500 text-white'
              : 'bg-transparent text-blue-700'
          }`}
          onClick={() => setTable('misc')}
        >
          Transaksi Lainnya
        </button>
        {table === 'trip' ? (
          <div className="flex justify-end mr-5 mb-3">
            <AddTruckTransactionButton
              truckId={truckId}
              autoCompleteData={autoCompleteData}
            />
          </div>
        ) : (
          <div className="flex justify-end mr-5 mb-3">
            <AddAdditionalTruckTransactionButton truckId={truckId} />
          </div>
        )}

        {table === 'trip' ? (
          <TruckTransactionDataTable
            headers={truckDataTableHeaders}
            data={truckTransactions.map((t) => formatTruckTransaction(t))}
            hiddenFields={[
              'id',
              'isPrinted',
              'truckId',
              'isPrintedBon',
              'isPrintedInvoice',
            ]}
            autoCompleteData={autoCompleteData}
          />
        ) : (
          <AdditionalTruckTransactionDataTable
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
    await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(truckId);
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
