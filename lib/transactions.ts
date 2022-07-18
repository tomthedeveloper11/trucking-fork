import axios from 'axios';
import { Transaction } from '../types/common';

const getTransactions = async () => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/transaction`,
  });
  if (response && response.data) {
    return response.data.data as Transaction[];
  }
  return [];
};

const transactionBloc = {
  getTransactions,
};

export default transactionBloc;
