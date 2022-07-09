import axios from 'axios';
import { TruckTransaction, Transaction } from '../types/common';

const getTruckTransactions = async () => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/truck`,
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};

const getTruckTransactionsByCustomerInitial = async (
  customerInitial: string
) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/customer/${customerInitial}`,
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};

const getTruckTransactionsByTruckId = async (truckId: string) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/truck/${truckId}`,
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};

const getMiscTruckTransactionsByTruckId = async (truckId: string) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/truck/misc/${truckId}`,
  });
  if (response && response.data) {
    return response.data.data as Transaction[];
  }
  return [];
};

const getTruckTransactionAutoComplete = async (): Promise<
  Record<string, string[]>
> => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/truck/auto-complete`,
  });
  if (response && response.data) {
    return response.data.data as Record<string, string[]>;
  }
  return {};
};

const printTransactions = async (transactionIds: string[]) => {
  await axios({
    method: 'POST',
    url: `http://localhost:3000/api/transaction/print`,
    data: {
      transactionIds,
    },
  });
};
const truckTransactionBloc = {
  getTruckTransactions,
  getTruckTransactionsByCustomerInitial,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  getTruckTransactionAutoComplete,
  printTransactions,
};

export default truckTransactionBloc;
