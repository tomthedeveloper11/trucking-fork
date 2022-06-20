import Modal from '../modal';
import axios from 'axios';
import { useContext, useState } from 'react';
import TextInput from '../text-input';
import TruckContext from '../context';
import { Truck } from '../../types/common';

export default function AddTruckButton() {
  const { allTruckState, setAllTruckState } = useContext(TruckContext);
  const [newTruck, setNewTruck] = useState({
    name: '',
    imageUrl: '',
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setNewTruck((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruck() {
    await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/truck',
      data: newTruck,
    });
    const allTrucks = [...allTruckState, newTruck];
    setAllTruckState(allTrucks);
    setNewTruck({ name: '', imageUrl: '' });
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
              <div className="grid grid-rows-2 grid-cols-3 grid-flow-row gap-4">
                <div className="form-group row-span-1 col-span-3">
                  <TextInput label="Name" name="name" onChange={handleChange} />
                </div>
                <div className="form-group row-span-1 col-span-3">
                  <TextInput
                    label="Image URL"
                    name="imageUrl"
                    onChange={handleChange}
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
