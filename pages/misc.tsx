import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTransactionButton from '../components/add-transaction-button';
import transactionBloc from '../lib/transactions';
import { Transaction } from '../types/common';
import TransactionDataTable from '../components/transaction-data-table';
import { useState } from 'react';

export default function TransactionPage({
  transactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const transactionDataTableHeaders = {
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTransaction = (transaction: Transaction) => {
    return {
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
    };
  };

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-10 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">
          Pengeluaran Lainnya Bulan ...
        </h1>
        <div className="flex justify-end mr-5 mb-3">
          <AddTransactionButton />
        </div>
        <TransactionDataTable
          headers={transactionDataTableHeaders}
          data={transactions.map((t) => formatTransaction(t))}
          hiddenFields={['id', 'isPrinted', 'truckId']}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const transactions = await transactionBloc.getTransactions();
  return {
    props: { transactions },
  };
};
