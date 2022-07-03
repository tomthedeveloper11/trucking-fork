import { Modal, Button, ListGroup } from 'flowbite-react';
import React, { useState } from 'react';
import TextInput from '../text-input';
import { TruckTransaction } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useToastContext } from '../../lib/toast-context';
import { PencilAltIcon } from '@heroicons/react/solid';

interface EditTruckTransactionButtonProps {
  existingTruckTransaction: TruckTransaction;
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

  const [day, month, year] = truckTransaction.date.toString().split('/');
  const [newDate, setNewDate] = useState(
    new Date(Number(year), Number(month) - 1, Number(day))
  );
  const [recommendation, setRecommendation] = useState({
    destination: [],
    customer: [],
  });

  const refreshData = useRouterRefresh();
  const addToast = useToastContext();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function filterKeywords(field: string, keyword: string) {
    const matchRegex = new RegExp(keyword, 'i');
    const matchedKeywords = autoCompleteData[field].filter((d) =>
      matchRegex.test(d)
    );
    return matchedKeywords;
  }

  function handleAutoComplete(
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const recommendations = filterKeywords(field, event.target.value);
    setRecommendation((prevState) => ({
      ...prevState,
      [field]: recommendations,
    }));
    setTruckTransaction((p) => ({
      ...p,
      [field]: event.target.value,
    }));
  }

  function selectAutocomplete(field: string, value: string) {
    setTruckTransaction((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setRecommendation((p) => ({
      ...p,
      [field]: [],
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
  return (
    <>
      <a
        className="text-[#F5D558] hover:underline"
        href={'#'}
        onClick={() => setModal(true)}
      >
        <PencilAltIcon />
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
                <div className="relative w-full">
                  <TextInput
                    label="EMKL"
                    name="customer"
                    value={truckTransaction.customer}
                    onChange={(e) => handleAutoComplete(e, 'customer')}
                  />
                  {/* autoComplete customer */}
                  <div
                    className={`absolute left-0 w-full ${
                      recommendation.customer.length ? '' : 'hidden'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <ListGroup>
                      {recommendation.customer.map((customer, i) => {
                        return (
                          <ListGroup.Item
                            key={`customer-auto-${i}`}
                            onClick={() =>
                              selectAutocomplete('customer', customer)
                            }
                          >
                            <div>{customer}</div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                  {/* autoComplete customer */}
                </div>
              </div>

              <div className="form-group row-span-1 col-span-3">
                <div className="relative w-full">
                  <TextInput
                    label="Tujuan"
                    name="destination"
                    value={truckTransaction.destination}
                    onChange={(e) => handleAutoComplete(e, 'destination')}
                  />
                  {/* autoComplete destination */}
                  <div
                    className={`absolute left-0 w-full ${
                      recommendation.destination.length ? '' : 'hidden'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <ListGroup>
                      {recommendation.destination.map((destination, i) => {
                        return (
                          <ListGroup.Item
                            key={`destination-auto-${i}`}
                            onClick={() =>
                              selectAutocomplete('destination', destination)
                            }
                          >
                            <div>{destination}</div>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                  {/* autoComplete destination */}
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
                  type="currency"
                  value={truckTransaction.sellingPrice}
                  prefix="Rp"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group row-span-1 col-span-5">
                <TextInput
                  label="Bon"
                  name="invoices"
                  // value={truckTransaction.details}
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
                  selected={newDate ? newDate : date}
                  dateFormat={'dd/M/yyyy'}
                  onChange={(date: Date) => {
                    setNewDate(date);
                    setDate(date);
                  }}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-[#F5D558] hover:bg-[#E3C652] text-white font-bold py-2 px-10 rounded w-full"
            onClick={() => {
              editTruckTransaction()
                .then(() => setModal(false))
                .catch((err) => addToast(err.response.data.message));
            }}
          >
            Edit Transaksi
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
