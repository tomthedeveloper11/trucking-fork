import { TruckTransaction } from '../../types/common';
import transactionRepository from './transaction.repository';

const createTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const newTruckTransaction =
    await transactionRepository.createTruckTransaction(truckTransactionPayload);
  return newTruckTransaction;
};

const getTransaction = async () => {
  const transactions = await transactionRepository.getTruckTransactions();
  return transactions;
};

const transactionService = {
  createTransaction,
  getTransaction,
};

export default transactionService;
