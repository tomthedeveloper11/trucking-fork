import { Modal } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from './text-input';
import { BASE_URL, Truck } from '../types/common';
import { useRouterRefresh } from '../hooks/hooks';
import { PencilAltIcon, PlusCircleIcon } from '@heroicons/react/outline';

export default function EditCustomerButton({ existingCustomer }) {
  const [customer, setCustomer] = useState(existingCustomer);
  const [modal, setModal] = useState(false);
  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setCustomer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function editCustomer() {
    await axios({
      method: 'PUT',
      url: `${BASE_URL}/api/customer/${customer.id}`,
      data: customer,
    });
    setCustomer({ initial: '', name: '', address: '' });
    refreshData();
  }

  return (
    <>
      <PencilAltIcon
        className="text-yellow-200 hover:text-yellow-300 cursor-pointer h-7 z-10 self-center"
        onClick={() => {
          setModal(true);
        }}
      />
      <Modal show={modal} onClose={() => setModal(false)}>
        <Modal.Header>Edit Truk</Modal.Header>
        <Modal.Body>
          <form action="post">
            <div className="grid grid-rows-2 grid-cols-3 grid-flow-row gap-4">
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Initial"
                  name="initial"
                  value={customer.initial}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Nama"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="Alamat"
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-[#F5D558] hover:bg-[#E3C652] text-white font-bold py-2 px-10 rounded w-full"
            onClick={() => {
              editCustomer();
              setModal(false);
            }}
          >
            Edit Customer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
