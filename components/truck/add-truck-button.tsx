import Modal from '../modal';
import axios from 'axios';
import { useState } from 'react';
import { Truck } from '../../types/common';

export default function AddTruckButton() {
  const [newTruck, setNewTruck] = useState({
    name: '',
    imageUrl: '',
  } as Truck);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setNewTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruck() {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/truck',
      data: newTruck,
    });

    const data = response.data.data;
    console.log(data);
  }

  return (
    <>
      <Modal
        buttonConfig={{ text: 'Tambah Truck Baru' }}
        confirmButtonConfig={{ text: 'Tambah Truck' }}
        onConfirm={addTruck}
        child={
          <>
            <h1 className="text-2xl">Tambah Truck Baru</h1>
            <form action="post">
              <div className="form-group m-3">
                <label>Name: </label>
                <input
                  className="border-2"
                  type="text"
                  value={newTruck.name}
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="form-group m-3">
                <label>ImageURL: </label>
                <input
                  className="border-2"
                  type="text"
                  value={newTruck.imageUrl}
                  name="imageUrl"
                  onChange={handleChange}
                />
              </div>
            </form>
          </>
        }
      />
    </>
  );
}
