import { Modal, Button, ListGroup } from 'flowbite-react';
import { useState } from 'react';
import TextInput from '../text-input';
import { TruckTransaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useToastContext } from '../../lib/toast-context';

interface EditTruckTransactionButtonProps {
  existingTruckTransaction: Omit<TruckTransaction, 'date'>;
  autoCompleteData: Record<string, string[]>;
}

export default function EditTruckTransactionButton({
  existingTruckTransaction,
  autoCompleteData,
}: EditTruckTransactionButtonProps) {
  const [truckTransaction, setTruckTransaction] = useState(
    existingTruckTransaction
  );
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState(new Date());

  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function editTruckTransaction() {
    await axios({
      method: 'PUT',
      url: `http://localhost:3000/api/transaction/truck/${truckTransaction.id}`,
      data: { ...truckTransaction, date },
    });

    refreshData();
  }
  console.log('asd');
  return (
    <>
      <a
        className="text-blue-500 hover:underline"
        href={'#'}
        onClick={() => setModal(true)}
      >
        Edit
      </a>
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Edit Transaksi</Modal.Header>
        <Modal.Body>
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
                <div className="flex flex-row flex-wrap">
                  <div className="relative w-full">
                    <TextInput
                      label="Tujuan"
                      name="destination"
                      value={truckTransaction.destination}
                      onChange={handleChange}
                    />
                    <div
                      className="absolute left-0 w-full"
                      style={{ zIndex: 2 }}
                    >
                      <ListGroup>
                        {autoCompleteData.destinations.map((destination, i) => {
                          return (
                            <ListGroup.Item key={`destination-auto-${i}`}>
                              <div>{destination}</div>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </div>
                  </div>
                </div>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              editTruckTransaction()
                .then(() => setModal(false))
                .catch((err) => addToast(err.message));
            }}
          >
            Edit Transaksi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
