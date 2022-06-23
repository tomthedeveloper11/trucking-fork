import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import AddTruckTransactionButton from '../../components/truck/add-truck-transaction-button';
import truckTransactionBloc from '../../lib/truckTransactions';
import { TransactionType, TruckTransaction } from '../../types/common';
import DataTable from '../../components/data-table';
import { Button } from 'flowbite-react';
import { useToastContext } from '../../lib/toast-context';
import { useState } from 'react';
import Modal from '../../components/modal';
import EditTruckTransactionModal from '../../components/truck/edit-truck-transaction-form';

type RawTruckTransaction = Omit<
  TruckTransaction,
  'transactionType' | 'truckId' | 'id'
>;

export default function TruckDetails({
  truckId,
  truckTransactions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const addToast = useToastContext();

  const [editModal, setEditModal] = useState(false);
  const [existingTruckTransaction, setExistingTruckTransaction] = useState(
    {} as Omit<TruckTransaction, 'id' | 'date'>
  );

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
  ): RawTruckTransaction => {
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
  function editTransaction(transaction: RawTruckTransaction) {
    console.log(transaction, 'halo123');
    setExistingTruckTransaction({
      ...transaction,
      transactionType: TransactionType.TRUCK_TRANSACTION,
      truckId,
    });
    setEditModal(true);
  }

  return (
    <>
      <Head>
        <title>Truck Details</title>
      </Head>

      {editModal ? (
        <EditTruckTransactionModal
          truckId={truckId}
          existingTruckTransaction={existingTruckTransaction}
          setModal={setEditModal}
        />
      ) : null}

      <div className="px-32 py-14 w-">
        <div className="my-4">
          <Button onClick={toast}>hello</Button>
          <AddTruckTransactionButton truckId={truckId} />
        </div>
        <DataTable
          headers={dataTableHeaders}
          data={truckTransactions.map((t) => formatTruckTransaction(t))}
          editableRow={true}
          onEdit={editTransaction}
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
