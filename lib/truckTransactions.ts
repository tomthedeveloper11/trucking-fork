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

const getGroupedTruckTransactions = async () => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/summary`,
  });
  if (response && response.data) {
    return response.data.data;
  }
  return [];
};

const getTruckTransactionsByCustomerId = async (customerId: string) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/customer/${customerId}`,
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
    url: `http://localhost:3000/api/transaction/truck/misc/${truckId}`,
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
  const fetchData = async () => {
    const data = await fetch('http://localhost:3000/api/transaction/print', {
      method: 'POST',
      body: JSON.stringify({
        transactionIds,
      }),
    });
    return data.arrayBuffer();
  };

  const saveAsPDF = async () => {
    const buffer = await fetchData();
    const blob = new Blob([buffer]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.pdf';
    link.click();
  };

  saveAsPDF();
};
const truckTransactionBloc = {
  getTruckTransactions,
  getGroupedTruckTransactions,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  getTruckTransactionAutoComplete,
  printTransactions,
};

export default truckTransactionBloc;
