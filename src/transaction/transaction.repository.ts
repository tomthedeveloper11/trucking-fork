import {
  EditTruckTransactionPayload,
  TransactionType,
  TruckTransaction,
  TruckTransactionPayload,
  Transaction,
} from '../../types/common';
import { TransactionModel } from './transaction.model';
import { Document } from 'mongoose';
import _ from 'lodash';
import { CustomerModel } from '../customer/customer.model';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const mapTruckTransaction = (document: Document) => {
  const truckTransaction = document.toObject({
    getters: true,
  }) as TruckTransaction;
  truckTransaction.customer = _.get(truckTransaction, 'customer.initial');
  return truckTransaction;
};

const getTruckTransactions = async () => {
  const documents = await TransactionModel.find({
    transactionType: TransactionType.TRUCK_TRANSACTION,
  }).sort({ date: -1 });
  const truckTransactions = documents.map((doc) =>
    convertDocumentToObject<TruckTransaction>(doc)
  );
  return truckTransactions;
};

const getTruckTransactionsByCustomerId = async (customerId: string) => {
  const documents = await TransactionModel.find({
    'customer.customerId': customerId,
    transactionType: TransactionType.TRUCK_TRANSACTION,
  }).sort({ date: -1 });
  const truckTransactions = documents.map((doc) => mapTruckTransaction(doc));
  return truckTransactions;
};

const getTruckTransactionsByTruckId = async (truckId: string) => {
  const documents = await TransactionModel.find({
    truckId,
    transactionType: TransactionType.TRUCK_TRANSACTION,
  }).sort({ date: -1 });
  const truckTransactions = documents.map((doc) => mapTruckTransaction(doc));
  return truckTransactions;
};

const getMiscTruckTransactionsByTruckId = async (truckId: string) => {
  const documents = await TransactionModel.find({
    truckId,
    transactionType: TransactionType.TRUCK_ADDITIONAL_TRANSACTION,
  }).sort({ date: -1 });
  const truckTransactions = documents.map((doc) => mapTruckTransaction(doc));
  return truckTransactions;
};

const createTruckTransaction = async (
  truckTransactionPayload: TruckTransactionPayload
) => {
  const document = await TransactionModel.create(truckTransactionPayload);
  const truckTransaction = convertDocumentToObject<TruckTransaction>(document);
  return truckTransaction;
};

const createTransaction = async (transactionPayload: Transaction) => {
  const document = await TransactionModel.create(transactionPayload);
  const transaction = convertDocumentToObject<Transaction>(document);
  return transaction;
};

const editTruckTransaction = async (
  editTruckTransactionPayload: EditTruckTransactionPayload
) => {
  const document = await TransactionModel.findOneAndUpdate(
    { _id: editTruckTransactionPayload.id },
    editTruckTransactionPayload
  );
  const truckTransaction = convertDocumentToObject<TruckTransaction>(document);
  return truckTransaction;
};

const getTruckTransactionAutoComplete = async (): Promise<
  Record<string, string[]>
> => {
  const fields = ['destination'];
  const [destinations] = await Promise.all(
    fields.map((field) =>
      TransactionModel.distinct(field, {
        type: TransactionType.TRUCK_TRANSACTION,
      })
    )
  );

  const customers = (await CustomerModel.find({})).map((c) => c.initial);
  const result = {
    destination: destinations.filter((_) => _),
    customer: customers.filter((_) => _),
  };
  return result;
};

const printTransaction = async (transactionIds: string[]) => {
  await TransactionModel.updateMany(
    { _id: { $in: transactionIds } },
    { isPrinted: true }
  );
};

const transactionRepository = {
  createTransaction,
  getTruckTransactions,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  createTruckTransaction,
  editTruckTransaction,
  getTruckTransactionAutoComplete,
  printTransaction,
};

export default transactionRepository;
