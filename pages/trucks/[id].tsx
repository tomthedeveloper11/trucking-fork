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
  redirectToLogin,
} from '../../types/common';
import TruckTransactionDataTable from '../../components/truck-transaction-data-table';
import AdditionalTruckTransactionDataTable from '../../components/additional-truck-transaction-data-table';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import authorizeUser from '../../helpers/auth';
import { useRouterRefresh } from '../../hooks/hooks';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/outline';

const date = new Date();
const defaultStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
const defaultEndDate = new Date(new Date().setHours(23, 59, 59));

export default function TruckDetails({
  truckName,
  truckId,
  truckTransactions,
  miscTruckTransactions,
  autoCompleteData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();
  const refreshData = useRouterRefresh();

  const [truckTransactionsState, setTruckTransactionsState] =
    useState(truckTransactions);
  const [miscTruckTransactionsState, setMiscTruckTransactionsState] = useState(
    miscTruckTransactions
  );

  useEffect(() => {
    setTruckTransactionsState(truckTransactions);
    setMiscTruckTransactionsState(miscTruckTransactions);
  }, [truckTransactions, miscTruckTransactions]);

  const truckDataTableHeaders = {
    No: '',
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

  if (user?.role === 'user') {
    delete truckDataTableHeaders.Pembayaran;
  }

  const miscDataTableHeaders = {
    No: '',
    Tanggal: 'w-3/12',
    Deskripsi: 'w-4/12',
    Harga: 'w-3/12',
  };

  const formatTruckTransaction = (
    truckTransaction: TruckTransaction,
    index: number
  ): DataTableTruckTransaction => {
    return {
      no: index,
      id: truckTransaction.id,
      date: new Date(truckTransaction.date).toLocaleDateString('id-ID'),
      containerNo: truckTransaction.containerNo,
      invoiceNo: truckTransaction.invoiceNo,
      destination: truckTransaction.destination,
      cost: truckTransaction.cost,
      sellingPrice: truckTransaction.sellingPrice,
      income: truckTransaction.income
        ? truckTransaction.income
        : truckTransaction.sellingPrice,
      pph: truckTransaction?.pph,
      customer: truckTransaction.customer,
      bon: truckTransaction.bon,
      details: truckTransaction.details,
      truckId: truckTransaction.truckId,
      isPrintedBon: truckTransaction.isPrintedBon,
      isPrintedInvoice: truckTransaction.isPrintedInvoice,
      editableByUserUntil: truckTransaction.editableByUserUntil,
    };
  };

  const formatMiscTransaction = (
    transaction: AdditionalTruckTransaction,
    index: number
  ): DataTableAdditionalTransaction => {
    return {
      no: index,
      id: transaction.id,
      date: new Date(transaction.date).toLocaleDateString('id-ID'),
      details: transaction.details,
      cost: transaction.cost,
      truckId: transaction.truckId,
      editableByUserUntil: transaction.editableByUserUntil,
    };
  };

  const [table, setTable] = useState('trip');
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(23, 59, 59))
  );

  async function filterByMonth() {
    const truckTransactions =
      await truckTransactionBloc.getTruckTransactionsByTruckId(
        user.access_token,
        truckId,
        startDate,
        endDate
      );

    const miscTruckTransactions =
      await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
        user.access_token,
        truckId,
        startDate,
        endDate
      );

    setTruckTransactionsState(truckTransactions);
    setMiscTruckTransactionsState(miscTruckTransactions);
  }

  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="container p-8 mb-60 flex-col">
        <h1 className="text-center text-7xl mb-5">{truckName}</h1>

        <div>
          <button
            className={`hover:bg-blue-500 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded-t-lg ${
              table === 'trip'
                ? 'bg-blue-500 text-white z-10 pt-3 px-5'
                : 'bg-transparent text-blue-700'
            }`}
            onClick={() => {
              setTable('trip');
              setQuery('');
            }}
          >
            Transaksi Trip
          </button>
          <button
            className={` hover:bg-blue-500 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded-t-lg ${
              table === 'misc'
                ? 'bg-blue-500 text-white pt-3 px-5'
                : 'bg-transparent text-blue-700'
            }`}
            onClick={() => {
              setTable('misc');
              setQuery('');
            }}
          >
            Transaksi Lainnya
          </button>
        </div>

        <div>
          <div className="flex bg-white py-5 gap-5 px-5">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder={
                    table === 'trip'
                      ? 'No Container / No Bon / Tujuan / EMKL'
                      : 'Deskripsi'
                  }
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                />
              </div>
            </form>

            <div className="flex gap-1 border rounded-full p-2 cursor-pointer">
              <TrashIcon className="h-5 mt-0.5" />
              <span className="whitespace-nowrap">Hapus</span>
            </div>
            <div className="flex gap-1 border rounded-full p-2 cursor-pointer">
              <PlusCircleIcon className="h-5 mt-0.5" />
              <span className="whitespace-nowrap">Tambah Transaksi</span>
            </div>

            <div className="flex xl:ml-72">
              <DatePicker
                className="w-28 text-center mx-1 rounded-sm"
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={(date: Date) =>
                  setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
                }
              />
              <span className="text-3xl mx-2">-</span>
              <DatePicker
                className="w-28 text-center mx-1 rounded-sm"
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
          </div>
          {table === 'trip' && user?.role !== 'guest' && (
            <div className="flex justify-end mr-5">
              <AddTruckTransactionButton
                truckId={truckId}
                autoCompleteData={autoCompleteData}
              />
            </div>
          )}{' '}
          {table === 'misc' && user?.role !== 'guest' && (
            <div className="flex justify-end mr-5">
              <AddAdditionalTruckTransactionButton truckId={truckId} />
            </div>
          )}
          {table === 'trip' ? (
            <div className="px-5 pb-5 bg-white rounded-md">
              <TruckTransactionDataTable
                headers={truckDataTableHeaders}
                data={truckTransactionsState
                  .filter((truckTransaction) => {
                    if (query === '') {
                      return truckTransaction;
                    } else if (
                      truckTransaction.containerNo
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      truckTransaction.invoiceNo
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      truckTransaction.destination
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      truckTransaction.customer
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return truckTransaction;
                    }
                  })
                  .map((t, i) => formatTruckTransaction(t, i + 1))}
                hiddenFields={[
                  'id',
                  'isPrinted',
                  'truckId',
                  'isPrintedBon',
                  'isPrintedInvoice',
                  'pph',
                  'sellingPrice',
                  'editableByUserUntil',
                  user?.role === 'user' ? 'income' : '',
                ]}
                autoCompleteData={autoCompleteData}
              />
            </div>
          ) : (
            <div className="px-5 pb-5 bg-white rounded-md">
              <AdditionalTruckTransactionDataTable
                headers={miscDataTableHeaders}
                data={miscTruckTransactionsState
                  .filter((miscTruckTransaction) => {
                    if (query === '') {
                      return miscTruckTransaction;
                    } else if (
                      miscTruckTransaction.details
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    ) {
                      return miscTruckTransaction;
                    }
                  })
                  .map((t, i) => formatMiscTransaction(t, i + 1))}
                hiddenFields={[
                  'id',
                  'isPrinted',
                  'truckId',
                  'editableByUserUntil',
                ]}
              />
            </div>
          )}
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

  const truckId: string = context.params.id;
  const truckName: string = context.query.truckName;

  const truckTransactions =
    await truckTransactionBloc.getTruckTransactionsByTruckId(
      access_token,
      truckId,
      defaultStartDate,
      defaultEndDate
    );
  const miscTruckTransactions =
    await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
      access_token,
      truckId,
      defaultStartDate,
      defaultEndDate
    );
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
