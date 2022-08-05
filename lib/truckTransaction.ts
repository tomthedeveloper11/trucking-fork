import { TransactionSummaryQuery } from './../types/common';
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

const getGroupedTruckTransactions = async ({
  access_token,
  startDate,
  endDate,
}: TransactionSummaryQuery) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/summary/trucks`,
    headers: {
      access_token
    },
    params: {
      startDate,
      endDate,
    },
  });
  if (response && response.data) {
    return response.data.data;
  }
  return {};
};

const getTotalSummary = async ({
  startDate,
  endDate,
}: TransactionSummaryQuery) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/summary/`,
    params: {
      startDate,
      endDate,
    },
  });
  if (response && response.data) {
    return response.data.data;
  }
  return {};
};

const getTruckTransactionsByCustomerId = async (
  customerId,
  startDate,
  endDate
) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/customer/${customerId}`,
    params: {
      startDate,
      endDate,
    },
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};

const getTruckTransactionsByTruckId = async (
  truckId: string,
  startDate: Date,
  endDate: Date
) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/truck/${truckId}`,
    params: {
      startDate,
      endDate,
    },
  });
  if (response && response.data) {
    return response.data.data as TruckTransaction[];
  }
  return [];
};

const getAdditionalTruckTransactionsByTruckId = async (
  truckId: string,
  startDate: Date,
  endDate: Date
) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction/truck/misc`,
    params: {
      truckId,
      startDate,
      endDate,
    },
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

const printTransactions = async (transactionIds: string[], type: string) => {
  const response = await axios({
    method: 'POST',
    url: 'http://localhost:3000/api/transaction/print',
    data: {
      transactionIds,
      type,
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

  if (response) return 'Print Success';
  return 'Print Failed';
};

const printSummary = async ({ startDate, endDate }) => {
  const response = await axios({
    method: 'GET',
    url: 'http://localhost:3000/api/transaction/printSummary',
    responseType: 'blob',
    params: {
      startDate,
      endDate,
    },
  });

  const saveAsPDF = async (response: any) => {
    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'summary.pdf';
    link.click();
  };

  saveAsPDF(response.data);

  if (response) return 'Print Success';
  return 'Print Failed';
};

const truckTransactionBloc = {
  getTruckTransactions,
  getGroupedTruckTransactions,
  getTotalSummary,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getAdditionalTruckTransactionsByTruckId,
  getTruckTransactionAutoComplete,
  printTransactions,
  printSummary,
};

export default truckTransactionBloc;
