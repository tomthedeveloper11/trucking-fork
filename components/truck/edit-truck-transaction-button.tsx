import Modal from '../modal';
import { useState } from 'react';
import TextInput from '../text-input';
import { TransactionType, TruckTransaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EditTruckTransactionButtonProps {
  truckId: string;
  existingTruckTransaction: Omit<TruckTransaction, 'id' | 'date'>;
}

export default function EditTruckTransactionButton({
  truckId,
  existingTruckTransaction,
}: EditTruckTransactionButtonProps) {
  const baseTruckTransaction: Omit<TruckTransaction, 'date'> = {
    id: '',
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
    existingTruckTransaction
  );
  const [date, setDate] = useState(new Date());

  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function editTruckTransaction() {
    // TODO: EDIT TRANSACTION PLSSSSSSSS

    // await axios({
    //   method: 'POST',
    //   url: `http://localhost:3000/api/transaction/${truckId}`,
    //   data: { ...truckTransaction, date },
    // });
    setTruckTransaction(baseTruckTransaction);
    refreshData();
  }

  return (
    <>
      <Modal
        id="edit-truck-transaction-modal"
        buttonConfig={{ text: 'Edit' }}
        confirmButtonConfig={{ text: 'Edit Transaksi' }}
        onConfirm={editTruckTransaction}
        width="w-2/5"
        child={
          <>
            <h1 className="text-2xl">Edit Transaksi</h1>
            <form action="post">
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
                  <label>Tanggal</label>
                  <DatePicker
                    selected={date}
                    onChange={(date: Date) => setDate(date)}
                  />
                </div>
              </div>
            </form>
          </>
        }
      />
    </>
  );
}
