import axios from 'axios';
import { Truck } from '../types/common';

const getTrucks = async () => {
  const response = await axios({
    method: 'GET',
    url: 'http://localhost:3000/api/truck',
  });
  if (response && response.data) {
    return response.data.data as Truck[];
  }
  return [];
};
const truckBloc = { getTrucks };

export default truckBloc;
