import {
  TruckTransaction,
  TruckTransactionPayload,
  FilterTransactionsQuery,
  AdditionalTruckTransaction,
  TransactionSummaryQuery,
  TransactionSummary,
  TotalSummary,
  Transaction,
  TransactionType,
} from '../../types/common';
import transactionRepository from './transaction.repository';
import truckRepository from '../truck/truck.repository';

import {
  formatRupiah,
  formatDate,
  indexPlusOne,
} from '../../helpers/hbsHelpers';
import fs from 'fs';
import puppeteer from 'puppeteer';
import handlers from 'handlebars';
import customerService from '../customer/customer.service';

const validateAndModifyPayload = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const customer = await customerService.getCustomerByInitial(
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

const editTransaction = async (transactionPayload: Transaction) => {
  const newTransaction = await transactionRepository.editTransaction(
    transactionPayload
  );
  return newTransaction;
};

const deleteTransaction = async (transactionId: string) => {
  const transaction = await transactionRepository.deleteTransaction(
    transactionId
  );
  return transaction;
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
            ? transaction.sellingPrice - transaction.cost
            : 0 - transaction.cost),
      };
    }
  }

  return summary;
};

const getTotalSummary = async (date: TransactionSummaryQuery) => {
  const transactions = await transactionRepository.getAllTransactions(date);

  const summary: TotalSummary = {
    totalAdditionalCost: 0,
    totalTripCost: 0,
    totalTripSellingPrice: 0,
    totalMargin: 0,
  };

  for (const transaction of transactions) {
    if (
      transaction.transactionType === TransactionType.TRUCK_TRANSACTION ||
      transaction.transactionType ===
        TransactionType.TRUCK_ADDITIONAL_TRANSACTION
    ) {
      summary.totalTripCost += transaction.cost;
    }

    if (
      transaction.transactionType === TransactionType.ADDITIONAL_TRANSACTION
    ) {
      summary.totalAdditionalCost += transaction.cost;
    }

    summary.totalTripSellingPrice += transaction.sellingPrice
      ? transaction.sellingPrice
      : 0;

    summary.totalMargin += transaction.sellingPrice
      ? transaction.sellingPrice - transaction.cost
      : 0 - transaction.cost;
  }

  return summary;
};

const getTruckTransactionsByCustomerId = async ({
  customerId,
  startDate,
  endDate,
}) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByCustomerId(
      customerId,
      startDate,
      endDate
    );
  return transactions;
};

const getTruckTransactionsByTruckId = async ({
  truckId,
  startDate,
  endDate,
}) => {
  const transactions =
    await transactionRepository.getTruckTransactionsByTruckId(
      truckId,
      startDate,
      endDate
    );
  return transactions;
};

const getAdditionalTruckTransactionsByTruckId = async ({
  truckId,
  startDate,
  endDate,
}) => {
  const transactions =
    await transactionRepository.getAdditionalTruckTransactionsByTruckId(
      truckId,
      startDate,
      endDate
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

const printTransaction = async (transactionIds: string[], type: string) => {
  handlers.registerHelper('formatRupiah', formatRupiah);
  handlers.registerHelper('formatDate', formatDate);
  handlers.registerHelper('indexPlusOne', indexPlusOne);

  const truckTransactions = await transactionRepository.printTransaction(
    transactionIds,
    type
  );

  const sortedTruckTransactions = truckTransactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalSellingPrice = sortedTruckTransactions.reduce(
    (accumulator, obj) => accumulator + obj.sellingPrice,
    0
  );

  const trucks = await truckRepository.getTrucks();
  const customer = await customerService.getCustomerByInitial(
    sortedTruckTransactions[0].customer
  );

  for (const truckTransaction of sortedTruckTransactions) {
    const licenseNumber = trucks.find(
      (t) => t.id === truckTransaction.truckId
    )?.licenseNumber;

    truckTransaction.licenseNumber = licenseNumber;
  }

  const content = {
    main: {
      currentDate: new Date(),
      customerInitial: sortedTruckTransactions[0].customer,
      customerName: customer?.name,
      totalSellingPrice,
    },
    transactions: sortedTruckTransactions,
  };

  let file;
  if (type === 'bon') {
    file = fs.readFileSync('./bon.html', 'utf8');
  } else {
    file = fs.readFileSync('./tagihan.html', 'utf8');
  }

  const template = handlers.compile(`${file}`);
  const html = template(content);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({ format: 'A4' });

  return pdf;
};

const filterTruckTransactions = async (query: FilterTransactionsQuery) => {
  // TODO
  transactionRepository.filterTruckTransactions(query);
};

const transactionService = {
  createTruckTransaction,
  createAdditionalTruckTransaction,
  getTruckTransactions,
  deleteTransaction,
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
  editTransaction,
};

export default transactionService;
