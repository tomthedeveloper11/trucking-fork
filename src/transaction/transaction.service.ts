import { TruckTransaction } from '../../types/common';
import transactionRepository from './transaction.repository';

const createTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const newTruckTransaction =
    await transactionRepository.createTruckTransaction(truckTransactionPayload);
  return newTruckTransaction;
};

const getTruckTransactions = async () => {
  const transactions = await transactionRepository.getTruckTransactions();
  return transactions;
};

const getTruckTransactionsByCustomerInitial = async (
  customerInitial: string
) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByCustomerInitial(
      customerInitial
    );
  return transactions;
};

const getTruckTransactionsByTruckId = async (truckId: string) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByTruckId(truckId);
  return transactions;
};

const editTruckTransaction = async (
  editTruckTransactionPayload: TruckTransaction
) => {
  const editTruckTransaction = await transactionRepository.editTruckTransaction(
    editTruckTransactionPayload
  );
  return editTruckTransaction;
};

const getTruckTransactionAutoComplete = async () => {
  const truckTransactionAutoComplete =
    await transactionRepository.getTruckTransactionAutoComplete();

  return truckTransactionAutoComplete;
};

const transactionService = {
  createTransaction,
  getTruckTransactions,
  getTruckTransactionsByCustomerInitial,
  getTruckTransactionsByTruckId,
  editTruckTransaction,
  getTruckTransactionAutoComplete,
};

export default transactionService;
