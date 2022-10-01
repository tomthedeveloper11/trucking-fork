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
import moment from 'moment';
import { useRouter } from 'next/router';
import { useToastContext } from '../../lib/toast-context';


const defaultStartDate = moment().startOf('month').toDate();
const defaultEndDate = moment().endOf('day').toDate();
function getStartDateEndDate(urlQuery: any) {
  const startDateQuery: string = urlQuery.startDate;
  const endDateQuery: string = urlQuery.endDate;

  const startDate = startDateQuery
    ? new Date(startDateQuery)
    : defaultStartDate;
  const endDate = endDateQuery ? new Date(endDateQuery) : defaultEndDate;

  return {
    startDate,
    endDate,
  };
}

export default function TruckDetails({
  truckName,
  truckId,
  truckTransactions,
  miscTruckTransactions,
  autoCompleteData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();
  const router = useRouter();
  const addToast = useToastContext();

  const [truckTransactionsState, setTruckTransactionsState] =
    useState(truckTransactions);
  const [miscTruckTransactionsState, setMiscTruckTransactionsState] = useState(
    miscTruckTransactions
  );

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);

    setTruckTransactionsState(truckTransactions);
    setMiscTruckTransactionsState(miscTruckTransactions);

    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
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
    getStartDateEndDate(router.query).startDate
  );
  const [endDate, setEndDate] = useState(
    getStartDateEndDate(router.query).endDate
  );

  async function filterByMonth() {
    router.push({
      pathname: router.asPath.split('?')[0],
      query: {
        truckName: router.query.truckName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    // const truckTransactions =
    //   await truckTransactionBloc.getTruckTransactionsByTruckId(
    //     user.access_token,
    //     truckId,
    //     startDate,
    //     endDate
    //   );

    // const miscTruckTransactions =
    //   await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
    //     user.access_token,
    //     truckId,
    //     startDate,
    //     endDate
    //   );
    // setTruckTransactionsState(truckTransactions);
    // setMiscTruckTransactionsState(miscTruckTransactions);
    addToast('Filter Success!');
  }

  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      <div className="w-full p-5 mb-60">
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
          {width > 1200 ? (
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
                  className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10"
                  onClick={filterByMonth}
                >
                  Filter
                </button>
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
            </div>
          ) : (
            <>
              <form className="flex items-center bg-white py-5">
                <div className="relative w-[45vw] text-center justify-center mx-auto">
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
              <div className="flex justify-between bg-white pb-5 gap-2 px-5">
                <div className="flex">
                  <DatePicker
                    className="w-28 text-center rounded-sm focus:ring-green-400 focus:border-green-500"
                    dateFormat="dd/MM/yyyy"
                    selected={startDate}
                    onChange={(date: Date) =>
                      setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
                    }
                  />
                  <span className="text-3xl mx-1">-</span>
                  <DatePicker
                    className="w-28 text-center rounded-sm focus:ring-green-400 focus:border-green-500"
                    dateFormat="dd/MM/yyyy"
                    selected={endDate}
                    onChange={(date: Date) =>
                      setEndDate(new Date(new Date(date).setHours(23, 59, 59)))
                    }
                    minDate={startDate}
                  />
                  <button
                    className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10"
                    onClick={filterByMonth}
                  >
                    Filter
                  </button>
                </div>
                {table === 'trip' && user?.role !== 'guest' && (
                  <div className="flex">
                    <AddTruckTransactionButton
                      truckId={truckId}
                      autoCompleteData={autoCompleteData}
                    />
                  </div>
                )}{' '}
                {table === 'misc' && user?.role !== 'guest' && (
                  <div className="flex">
                    <AddAdditionalTruckTransactionButton truckId={truckId} />
                  </div>
                )}
              </div>
            </>
          )}

          {table === 'trip' ? (
            <div className="px-5 pb-5 bg-white rounded">
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
            <div className="px-5 pb-5 bg-white rounded">
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
  const { startDate, endDate } = getStartDateEndDate(context.query);

  const truckTransactions =
    await truckTransactionBloc.getTruckTransactionsByTruckId(
      access_token,
      truckId,
      startDate,
      endDate
    );
  const miscTruckTransactions =
    await truckTransactionBloc.getAdditionalTruckTransactionsByTruckId(
      access_token,
      truckId,
      startDate,
      endDate
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
