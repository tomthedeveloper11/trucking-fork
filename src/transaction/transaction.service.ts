import {
  TruckTransaction,
  TruckTransactionPayload,
  FilterTransactionsQuery,
  AdditionalTruckTransaction,
  TransactionSummaryQuery,
  TransactionSummary,
  TotalSummary,
  Transaction,
} from '../../types/common';
import customerRepository from '../customer/customer.repository';
import transactionRepository from './transaction.repository';
import truckRepository from '../truck/truck.repository';

const validateAndModifyPayload = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const customer = await customerRepository.getCustomerByInitial(
    truckTransactionPayload.customer
  );
  if (!customer) {
    throw new Error('Customer tidak terdaftar');
  }
  const modifiedPayload: TruckTransactionPayload = {
    ...truckTransactionPayload,
    customer: {
      customerId: customer.id,
      initial: customer.initial,
    },
  };
  return modifiedPayload;
};

const createTruckTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const modifiedPayload = await validateAndModifyPayload(
    truckTransactionPayload
  );
  console.log(modifiedPayload, 'modifiedPayload');
  const newTruckTransaction =
    await transactionRepository.createTruckTransaction(modifiedPayload);
  return newTruckTransaction;
};

const createAdditionalTruckTransaction = async (
  transactionPayload: AdditionalTruckTransaction
) => {
  const newTransaction =
    await transactionRepository.createAdditionalTruckTransaction(
      transactionPayload
    );
  return newTransaction;
};

const getTransactions = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getTransactions(date);
  return transactions;
};

const createTransaction = async (transactionPayload: Transaction) => {
  const newTransaction = await transactionRepository.createTransaction(
    transactionPayload
  );
  return newTransaction;
};

const getTruckTransactions = async () => {
  const transactions = await transactionRepository.getTruckTransactions();
  return transactions;
};

const getGroupedTruckTransactions = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getAllTransactions(date);
  const trucks = await truckRepository.getTrucks();

  const summary: TransactionSummary = {};
  for (const transaction of transactions) {
    const truckName = trucks.find((t) => t.id === transaction.truckId)?.name;
    if (!truckName) {
      console.log(`Truck id not found ${transaction.truckId}`);
      continue;
    }

    if (!summary[truckName]) {
      summary[truckName] = {
        truckId: transaction.truckId,
        cost: transaction.cost,
        sellingPrice: transaction.sellingPrice,
        margin: transaction.sellingPrice - transaction.cost,
      };
    } else {
      summary[truckName] = {
        truckId: transaction.truckId,
        cost: summary[truckName].cost + transaction.cost,
        sellingPrice:
          summary[truckName].sellingPrice +
          (transaction.sellingPrice ? transaction.sellingPrice : 0),
        margin:
          summary[truckName].margin +
          (transaction.sellingPrice
            ? transaction.sellingPrice
            : 0 - transaction.cost),
      };
    }
  }

  return summary;
};

const getTotalSummary = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getAllTransactions(date);

  const summary: TotalSummary = { cost: 0, sellingPrice: 0, margin: 0 };

  for (const transaction of transactions) {
    summary.cost += transaction.cost;

    summary.sellingPrice += transaction.sellingPrice
      ? transaction.sellingPrice
      : 0;

    summary.margin += transaction.sellingPrice
      ? transaction.sellingPrice - transaction.cost
      : 0 - transaction.cost;
  }

  return summary;
};

const getTruckTransactionsByCustomerId = async (customerId: string) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByCustomerId(customerId);
  return transactions;
};

const getTruckTransactionsByTruckId = async (truckId: string) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByTruckId(truckId);
  return transactions;
};

const getAdditionalTruckTransactionsByTruckId = async (truckId: string) => {
  const transactions =
    await transactionRepository.getAdditionalTruckTransactionsByTruckId(
      truckId
    );
  return transactions;
};

const editTruckTransaction = async (
  editTruckTransactionPayload: TruckTransaction
) => {
  const modifiedPayload = await validateAndModifyPayload(
    editTruckTransactionPayload
  );

  const editTruckTransaction = await transactionRepository.editTruckTransaction(
    { ...modifiedPayload, id: editTruckTransactionPayload.id }
  );
  return editTruckTransaction;
};

const editAdditionalTruckTransaction = async (
  editAdditionalTruckTransactionPayload: AdditionalTruckTransaction
) => {
  const editAdditionalTruckTransaction =
    await transactionRepository.editAdditionalTruckTransaction({
      ...editAdditionalTruckTransactionPayload,
      id: editAdditionalTruckTransactionPayload.id,
    });
  return editAdditionalTruckTransaction;
};

const getTruckTransactionAutoComplete = async () => {
  const truckTransactionAutoComplete =
    await transactionRepository.getTruckTransactionAutoComplete();

  return truckTransactionAutoComplete;
};

const printTransaction = async (transactionIds: string[]) => {
  return await transactionRepository.printTransaction(transactionIds);
};

const filterTruckTransactions = async (query: FilterTransactionsQuery) => {
  // TODO
  transactionRepository.filterTruckTransactions(query);
};

const transactionService = {
  createTruckTransaction,
  createAdditionalTruckTransaction,
  getTruckTransactions,
  getGroupedTruckTransactions,
  getTotalSummary,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getAdditionalTruckTransactionsByTruckId,
  editTruckTransaction,
  editAdditionalTruckTransaction,
  getTruckTransactionAutoComplete,
  printTransaction,
  filterTruckTransactions,
  getTransactions,
  createTransaction,
};

export default transactionService;
