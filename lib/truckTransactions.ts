import axios from 'axios';
import { TruckTransaction, AdditionalTruckTransaction } from '../types/common';

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
    url: `http://localhost:3000/api/transaction/summary/trucks`,
  });
  if (response && response.data) {
    return response.data.data;
  }
  return {};
};

const getTotalSummary = async () => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/summary`,
  });
  if (response && response.data) {
    return response.data.data;
  }
  return {};
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
    return response.data.data as AdditionalTruckTransaction[];
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
  const response = await axios({
    method: 'POST',
    url: 'http://localhost:3000/api/transaction/print',
    data: {
      transactionIds,
    },
    responseType: 'blob',
  });

  const saveAsPDF = async (response: any) => {
    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.pdf';
    link.click();
  };

  saveAsPDF(response.data);
};
const truckTransactionBloc = {
  getTruckTransactions,
  getGroupedTruckTransactions,
  getTotalSummary,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  getTruckTransactionAutoComplete,
  printTransactions,
};

export default truckTransactionBloc;
