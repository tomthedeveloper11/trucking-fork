import { Modal } from 'flowbite-react';
import axios from 'axios';
import { useState } from 'react';
import TextInput from '../text-input';
import { BASE_URL, Truck } from '../../types/common';
import { useRouterRefresh } from '../../hooks/hooks';
import { PencilAltIcon, PlusCircleIcon } from '@heroicons/react/outline';

export default function EditTruckButton({ existingTruck }) {
  const [truck, setTruck] = useState(existingTruck);
  console.log("🚀 ~ file: edit-truck-button.tsx ~ line 11 ~ EditTruckButton ~ truck", truck)

  const [modal, setModal] = useState(false);
  const refreshData = useRouterRefresh();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function editTruck() {
    await axios({
      method: 'PUT',
      url: `${BASE_URL}/api/truck/${truck.id}`,
      data: truck,
    });
    setTruck({ name: '', licenseNumber: '' });
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
                  label="Nama"
                  name="name"
                  value={truck.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group row-span-1 col-span-3">
                <TextInput
                  label="NoPol"
                  name="licenseNumber"
                  value={truck.licenseNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="bg-green-400
            hover:bg-green-500 text-white font-bold py-2 px-10 rounded w-full"
            onClick={() => {
              editTruck();
              setModal(false);
            }}
          >
            Edit Truk
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
