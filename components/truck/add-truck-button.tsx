import Modal from '../modal';
import axios from 'axios';
import { useContext } from 'react';
import TextInput from '../text-input';
import TruckContext from '../context';

export default function AddTruckButton() {
  const { TruckState, setTruckState } = useContext(TruckContext);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setTruckState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function addTruck() {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3000/api/truck',
      data: TruckState,
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
