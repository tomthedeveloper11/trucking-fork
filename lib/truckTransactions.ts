import axios from 'axios';
import { TruckTransaction } from '../types/common';

const getTruckTransactions = async (truckId: string) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/truck/${truckId}`,
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};
const truckTransactionBloc = { getTruckTransactions };

export default truckTransactionBloc;
