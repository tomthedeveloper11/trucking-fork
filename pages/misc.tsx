import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTransactionButton from '../components/add-transaction-button';
import transactionBloc from '../lib/transactions';
import { redirectToLogin, Transaction } from '../types/common';
import TransactionDataTable from '../components/transaction-data-table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../helpers/auth';

const date = new Date();
const defaultStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
const defaultEndDate = new Date(new Date().setHours(23, 59, 59));

export default function TransactionPage({
  transactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  const transactionDataTableHeaders = {
    No: '',
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTransaction = (transaction: Transaction, index: number) => {
    return {
      no: index,
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
      editableByUserUntil: transaction.editableByUserUntil,
    };
  };

  const [transactionsState, setTransactionsState] = useState(transactions);

  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59))
  );

  useEffect(() => {
    setTransactionsState(transactions);
  }, [transactions]);

  async function filterByMonth() {
    const transactions = await transactionBloc.getTransactions({
      access_token: user.access_token,
      startDate,
      endDate,
    });

    setTransactionsState(transactions);
  }
  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">Pengeluaran Lain</h1>
        <div className="flex bg-white p-5 gap-5 justify-between">
          <form className="flex items-center">
            <div className="relative w-[20vw]">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                placeholder={'Deskripsi'}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
          </form>
          <div className="flex">
            <DatePicker
              className="w-32 text-center mx-1 rounded-sm focus:ring-green-400 focus:border-green-500"
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              onChange={(date: Date) =>
                setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
              }
            />
            <span className="text-3xl mx-2">-</span>
            <DatePicker
              className="w-32 text-center mx-1 rounded-sm focus:ring-green-400 focus:border-green-500"
              dateFormat="dd/MM/yyyy"
              selected={endDate}
              onChange={(date: Date) =>
                setEndDate(new Date(new Date(date).setHours(23, 59, 59)))
              }
              minDate={startDate}
            />
            <button
              className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={filterByMonth}
            >
              Filter
            </button>
          </div>
          {user?.role !== 'guest' && (
            <div className="flex justify-end mr-5">
              <AddTransactionButton />
            </div>
          )}
        </div>
        <div className="px-5 pb-5 bg-white rounded">
          <TransactionDataTable
            headers={transactionDataTableHeaders}
            data={transactionsState
              .filter((transaction) => {
                if (query === '') {
                  return transaction;
                } else if (
                  transaction.details
                    .toLowerCase()
                    .includes(query.toLowerCase())
                ) {
                  return transaction;
                }
              })
              .map((t, i) => formatTransaction(t, i + 1))}
            hiddenFields={['id', 'isPrinted', 'truckId', 'editableByUserUntil']}
          />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const access_token = getCookie('access_token', {
    req: context.req,
    res: context.res,
  });

  if (!access_token) return redirectToLogin;

  try {
    jwt.verify(access_token.toString(), process.env.SECRET_KEY);
  } catch (e) {
    return redirectToLogin;
  }

  const transactions = await transactionBloc.getTransactions({
    access_token,
    startDate: defaultStartDate,
    endDate: defaultEndDate,
  });

  return {
    props: { transactions },
  };
};
