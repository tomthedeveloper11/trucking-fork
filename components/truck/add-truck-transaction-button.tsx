import Modal from '../modal';
import axios from 'axios';
import { useState } from 'react';
import TextInput from '../text-input';
import { TransactionType, TruckTransaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddTruckTransactionButtonProps {
  truckId: string;
}

export default function AddTruckTransactionButton({
  truckId,
}: AddTruckTransactionButtonProps) {
  const placeHolderTransaction: Omit<TruckTransaction, 'id' | 'date'> = {
    containerNo: 'TEGU3009038',
    invoiceNo: '1671',
    destination: ' AMPLAS/CATUR ',
    cost: 385000,
    sellingPrice: 700000,
    customer: 'SKM',
    details: '',
    transactionType: TransactionType.TRUCK_TRANSACTION,
    truckId,
  };
  const baseTruckTransaction: Omit<TruckTransaction, 'id' | 'date'> = {
    containerNo: '',
    invoiceNo: '',
    destination: '',
    cost: 0,
    sellingPrice: 0,
    customer: '',
    details: '',
    transactionType: TransactionType.TRUCK_TRANSACTION,
    truckId,
  };
  const [truckTransaction, setTruckTransaction] = useState(
    placeHolderTransaction || baseTruckTransaction
  );
  const [startDate, setStartDate] = useState(new Date());

  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruckTransaction() {
    await axios({
      method: 'POST',
      url: `http://localhost:3000/api/transaction/${truckId}`,
      data: truckTransaction,
    });
    setTruckTransaction(baseTruckTransaction);
    refreshData();
  }

  return (
    <>
      <Modal
        buttonConfig={{ text: 'Tambah Transaksi Baru' }}
        confirmButtonConfig={{ text: 'Bikin Transaksi' }}
        onConfirm={addTruckTransaction}
        width="w-2/5"
        child={
          <>
            <h1 className="text-2xl text-center mb-4">Tambah Transaksi Baru</h1>
            <form action="post">
              <div className="flex justify-content-between space-x-3">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    No. Container
                  </label>
                  <input
                    type="text"
                    name="containerNo"
                    value={truckTransaction.containerNo}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    No. Invoice
                  </label>
                  <input
                    type="number"
                    name="invoiceNo"
                    value={truckTransaction.invoiceNo}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    EMKL
                  </label>
                  <input
                    type="text"
                    name="customer"
                    value={truckTransaction.customer}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-content-between space-x-3">
                <div className="grow mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tujuan
                  </label>
                  <input
                    name="destination"
                    value={truckTransaction.destination}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="shrink mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Borongan
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      Rp
                    </span>
                    <input
                      type="number"
                      name="cost"
                      value={truckTransaction.cost}
                      onChange={handleChange}
                      className="rounded-none rounded-r-lg bg-gray-50 border  text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-[6vw] text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="shrink mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Pembayaran
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-2 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      Rp
                    </span>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={truckTransaction.sellingPrice}
                      onChange={handleChange}
                      className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-[6vw] text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-content-between space-x-3">
                <div className="grow mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Deskripsi/Info Tambahan
                  </label>
                  <input
                    name="details"
                    value={truckTransaction.details}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Tanggal Transaksi
                  </label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    className="w-[8vw]"
                  />
                </div>
              </div>
            </form>
            {/* <form action="post">
              <div className="grid grid-rows-2 grid-cols-5 grid-flow-row gap-4">
                <div className="form-group row-span-1 col-span-2">
                  <TextInput
                    label="No. Container"
                    name="containerNo"
                    value={truckTransaction.containerNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group row-span-1 col-span-2">
                  <TextInput
                    label="No. Invoice"
                    name="invoiceNo"
                    value={truckTransaction.invoiceNo}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group row-span-1 col-span-1">
                  <TextInput
                    label="EMKL"
                    name="customer"
                    value={truckTransaction.customer}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group row-span-1 col-span-3">
                  <TextInput
                    label="Tujuan"
                    name="destination"
                    value={truckTransaction.destination}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group row-span-1 col-span-1">
                  <TextInput
                    label="Borongan"
                    name="cost"
                    type="currency"
                    value={truckTransaction.cost}
                    prefix="Rp"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group row-span-1 col-span-1">
                  <TextInput
                    label="Pembayaran"
                    name="sellingPrice"
                    value={truckTransaction.sellingPrice}
                    prefix="Rp"
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group row-span-1 col-span-5">
                  <TextInput
                    label="Deskripsi/Info Tambahan"
                    name="details"
                    value={truckTransaction.details}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group row-span-1 col-span-2">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                  />
                </div>
              </div>
            </form> */}
          </>
        }
      />
    </>
  );
}
