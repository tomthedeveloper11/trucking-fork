import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTransactionButton from '../components/add-transaction-button';
import transactionBloc from '../lib/transactions';
import { Transaction } from '../types/common';
import TransactionDataTable from '../components/transaction-data-table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const defaultStartDate = new Date(2020, 1, 1);
const defaultEndDate = new Date(new Date().setHours(23, 59, 59));

export default function TransactionPage({
  transactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const access_token = getCookie('access_token');
  const user = jwt.decode(access_token, process.env.SECRET_KEY);

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

  const [transactionsState, setTransactionsState] = useState(transactions);

  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59))
  );

  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);

  async function filterByMonth() {
    const transactions = await transactionBloc.getTransactions({
      startDate,
      endDate,
    });

    setTransactionsState(transactions);
  }

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">Pengeluaran Lain</h1>
        <div className="flex w-56 gap-5 mx-3 my-5">
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date: Date) =>
              setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
            }
          />
          <span className="text-3xl">-</span>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={endDate}
            onChange={(date: Date) =>
              setEndDate(new Date(new Date(date).setHours(23, 59, 59)))
            }
            minDate={startDate}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={filterByMonth}
          >
            Filter
          </button>
        </div>
        {user?.role !== 'guest' && (
          <div className="flex justify-end mr-5 mb-3">
            <AddTransactionButton />
          </div>
        )}
        <TransactionDataTable
          headers={transactionDataTableHeaders}
          data={transactionsState.map((t) => formatTransaction(t))}
          hiddenFields={['id', 'isPrinted', 'truckId']}
        />
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const transactions = await transactionBloc.getTransactions({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });
  return {
    props: { transactions },
  };
};
