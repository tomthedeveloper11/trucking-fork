import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import truckTransactionBloc from '../lib/truckTransaction';
import { formatRupiah } from '../helpers/hbsHelpers';

export default function Home({
  truckSummaries,
  summaries,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const entries = Object.entries(truckSummaries);
  const months = [
    { no: '1', name: 'Januari' },
    { no: '2', name: 'Februari' },
    { no: '3', name: 'Maret' },
    { no: '4', name: 'April' },
    { no: '5', name: 'Mei' },
    { no: '6', name: 'Juni' },
    { no: '7', name: 'Juli' },
    { no: '8', name: 'Agustus' },
    { no: '9', name: 'September' },
    { no: '10', name: 'Oktober' },
    { no: '11', name: 'November' },
    { no: '12', name: 'Desember' },
  ];
  const currentMonth = months[new Date().getMonth()].name;
  entries.sort();
  return (
    <>
      <Head>
        <title>{'Home'}</title>
      </Head>
      <div className="container m-auto">
        <h2 className="text-7xl text-center m-auto">
          Rekap Bulan {currentMonth}
        </h2>

        <div className="grid grid-cols-4 gap-7 text-center mt-6 border border-gray-200 rounded p-5 m-3 bg-zinc-100 shadow-md">
          <div className="bg-white shadow-md rounded">
            <div className="bg-green-100">
              <div className="bg-green-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Pembayaran</h3>
            </div>
            <h4 className="text-2xl font-bold  py-6">
              {formatRupiah(summaries.totalTripSellingPrice)}
            </h4>
          </div>

          <div className="bg-white shadow-md rounded">
            <div className="bg-red-100">
              <div className="bg-red-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Biaya Trip</h3>
            </div>
            <h4 className="text-2xl font-bold  py-6">
              {formatRupiah(summaries.totalTripCost)}
            </h4>
          </div>

          <div className="bg-white shadow-md rounded">
            <div className="bg-orange-100">
              <div className="bg-orange-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Biaya Lain</h3>
            </div>
            <h4 className="text-2xl font-bold py-6">
              {formatRupiah(summaries.totalAdditionalCost)}
            </h4>
          </div>

          <div className="bg-white shadow-md rounded">
            <div className="bg-blue-100">
              <div className="bg-blue-400 h-1 w-full"></div>
              <h3 className="text-2xl py-3">Total Margin</h3>
            </div>
            <h4 className="text-2xl font-bold py-6">
              {formatRupiah(summaries.totalMargin)}
            </h4>
          </div>
        </div>
        <hr className="m-5" />
        <div className="grid grid-cols-3">
          {entries.map((entry, i: number) => {
            return (
              <a
                href={`/trucks/${entry[1].truckId}?truckName=${entry[0]}`}
                key={i}
                className="gap-40 px-6 py-3 m-5 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
              >
                <div className="relative">
                  <h3 className="text-5xl whitespace-nowrap text-center justify-center align-middle">
                    {entry[0]}
                  </h3>
                </div>

                <div>
                  <h3 className="my-2 text-green-400 text-center font-medium">
                    Pembayaran: {formatRupiah(entry[1].sellingPrice)}
                  </h3>
                  <h3 className="my-2 text-red-400 text-center font-medium">
                    Biaya: {formatRupiah(entry[1].cost)}
                  </h3>
                  <hr />
                  <h3 className="my-2 text-center font-medium">
                    Margin: {formatRupiah(entry[1].margin)}
                  </h3>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (_: any) => {
  const truckSummaries =
    await truckTransactionBloc.getGroupedTruckTransactions();
  const summaries = await truckTransactionBloc.getTotalSummary();
  return {
    props: {
      truckSummaries,
      summaries,
    },
  };
};
