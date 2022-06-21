import { TruckTransaction } from '../../types/common';
import transactionRepository from './transaction.repository';

const createTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const newTruckTransaction =
    await transactionRepository.createTruckTransaction(truckTransactionPayload);
  return newTruckTransaction;
};

const getTruckTransactions = async (truckId: string) => {
  const transactions = await transactionRepository.getTruckTransactions(
    truckId
  );
  return transactions;
};

const transactionService = {
  createTransaction,
  getTruckTransactions,
};

export default transactionService;
