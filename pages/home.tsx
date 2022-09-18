import Head from 'next/head';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import truckTransactionBloc from '../lib/truckTransaction';
import { formatRupiah } from '../helpers/hbsHelpers';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getCookie } from 'cookies-next';
import * as jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { PrinterIcon } from '@heroicons/react/solid';
import authorizeUser from '../helpers/auth';
import { redirectToLogin } from '../types/common';
import Link from 'next/link';
import moment from 'moment';

const defaultStartDate = moment().startOf('month').utcOffset(7, false).toDate();
const defaultEndDate = moment().endOf('day').utcOffset(7, false).toDate();
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

export default function Home({
  truckSummaries,
  summaries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const user = authorizeUser();

  const router = useRouter();
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    const handleResizeWindow = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResizeWindow);

    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  });

  const [truckSummariesState, setTruckSummariesState] =
    useState(truckSummaries);

  const [summariesState, setSummariesState] = useState(summaries);

  useEffect(() => {
    setTruckSummariesState(truckSummaries);
    setSummariesState(summaries);
  }, [truckSummaries, summaries]);

  const entries = Object.entries(truckSummariesState);
  entries.sort();

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
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });

    // const truckSummaries =
    //   await truckTransactionBloc.getGroupedTruckTransactions({
    //     access_token: user.access_token,
    //     startDate,
    //     endDate,
    //   });
    // const summaries = await truckTransactionBloc.getTotalSummary({
    //   access_token: user.access_token,
    //   startDate,
    //   endDate,
    // });

    // setTruckSummariesState(truckSummaries);
    // setSummariesState(summaries);
  }

  async function printSummary() {
    await truckTransactionBloc.printSummary({
      startDate,
      endDate,
    });
  }
  const [query, setQuery] = useState('');

  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="w-full m-auto">
        <h2 className="text-7xl text-center m-auto">Rekap</h2>

        {width > 1200 ? (
          <div className="grid grid-cols-3 justify-between m-5">
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder={'Nama Truk'}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                />
              </div>
            </form>
            <div className="flex gap-5">
              <DatePicker
                className="w-32 text-center mx-1 rounded-sm focus:ring-green-400 focus:border-green-500"
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={(date: Date) =>
                  setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
                }
              />
              <span className="text-3xl">-</span>
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
            <div>
              {user?.role !== 'user' && (
                <button
                  className="flex gap-2 whitespace-nowrap bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded ml-5"
                  onClick={printSummary}
                >
                  <PrinterIcon className="h-5 mt-[2px]" />
                  Print Laporan
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className='m-3'>
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-green-400 focus:border-green-500 block w-full pl-10 p-2.5"
                  placeholder={'Nama Truk'}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoFocus
                />
              </div>
            </form>
            <div className="flex justify-between bg-white pb-5 gap-2 px-5">
              <div className="flex">
                <DatePicker
                  className="w-32 text-center mx-1 rounded-sm focus:ring-green-400 focus:border-green-500"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={(date: Date) =>
                    setStartDate(new Date(new Date(date).setHours(0, 0, 0)))
                  }
                />
                <span className="text-3xl">-</span>
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
              <div>
                {user?.role !== 'user' && (
                  <button
                    className="flex gap-2 whitespace-nowrap bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded ml-5"
                    onClick={printSummary}
                  >
                    <PrinterIcon className="h-5 mt-[2px]" />
                    Print Laporan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          className={`${
            user?.role === 'user' || width < 1200 ? 'grid-cols-2' : 'grid-cols-4'
          } grid gap-7 text-center mt-6 border border-gray-200 rounded p-5 m-3 bg-white shadow-md`}
        >
          {user?.role !== 'user' && (
            <div className="bg-white shadow-md rounded">
              <div className="bg-green-100">
                <div className="bg-green-400 h-1 w-full"></div>
                <h3 className="text-2xl py-3">Total Pembayaran</h3>
              </div>
              <h4 className="text-2xl font-bold  py-6">
                {formatRupiah(summariesState.totalTripSellingPrice)}
              </h4>
            </div>
          )}

          <div className="bg-white shadow-md rounded">
            <div className="bg-red-100">
              <div className="bg-red-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Pengeluaran Mobil</h3>
            </div>
            <h4 className="text-2xl font-bold  py-6">
              {formatRupiah(summariesState.totalTripCost)}
            </h4>
          </div>

          <div className="bg-white shadow-md rounded">
            <div className="bg-orange-100">
              <div className="bg-orange-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Pengeluaran Lain</h3>
            </div>
            <h4 className="text-2xl font-bold py-6">
              {formatRupiah(summariesState.totalAdditionalCost)}
            </h4>
          </div>

          {user?.role !== 'user' && (
            <div className="bg-white shadow-md rounded">
              <div className="bg-blue-100">
                <div className="bg-blue-400 h-1 w-full"></div>
                <h3 className="text-2xl py-3">Total Margin</h3>
              </div>
              <h4 className="text-2xl font-bold py-6">
                {formatRupiah(summariesState.totalMargin)}
              </h4>
            </div>
          )}
        </div>
        <hr className="m-5" />
        <div className="grid grid-cols-3">
          {entries
            .filter((entry) => {
              if (query === '') {
                return entry;
              } else if (entry[0].toLowerCase().includes(query.toLowerCase())) {
                return entry;
              }
            })
            .map((entry, i: number) => {
              return (
                <Link
                  href={`/trucks/${entry[1].truckId}?truckName=${entry[0]}`}
                  key={i}
                >
                  <div className="bg-white gap-40 px-6 py-3 m-5 rounded border border-gray-200 shadow-md hover:bg-gray-100 cursor-pointer">
                    <div className="relative">
                      <h3 className="text-5xl whitespace-nowrap text-center justify-center align-middle">
                        {entry[0]}
                      </h3>
                    </div>

                    <div>
                      {user?.role !== 'user' && (
                        <h3 className="my-2 text-green-400 text-center font-medium">
                          Pembayaran: {formatRupiah(entry[1].sellingPrice)}
                        </h3>
                      )}
                      <h3 className="my-2 text-red-400 text-center font-medium">
                        Borongan: {formatRupiah(entry[1].cost)}
                      </h3>
                      <h3 className="my-2 text-red-400 text-center font-medium">
                        Biaya: {formatRupiah(entry[1].additionalCost)}
                      </h3>
                      <hr />
                      {user?.role !== 'user' && (
                        <h3 className="my-2 text-center font-medium">
                          Margin: {formatRupiah(entry[1].margin)}
                        </h3>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
  const { startDate, endDate } = getStartDateEndDate(context.query);

  const truckSummaries = await truckTransactionBloc.getGroupedTruckTransactions(
    {
      access_token,
      startDate: startDate,
      endDate: endDate,
    }
  );
  const summaries = await truckTransactionBloc.getTotalSummary({
    access_token,
    startDate: startDate,
    endDate: endDate,
  });

  return {
    props: {
      truckSummaries,
      summaries,
    },
  };
};
