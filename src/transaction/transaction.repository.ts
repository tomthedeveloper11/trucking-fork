import { TransactionType, TruckTransaction } from '../../types/common';
import { TransactionModel } from './transaction.model';
import { Document } from 'mongoose';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const getTruckTransactions = async (truckId: string) => {
  const documents = await TransactionModel.find({
    truckId,
    type: TransactionType.TRUCK_TRANSACTION,
  });
  const truckTransactions = documents.map((doc) =>
    convertDocumentToObject<TruckTransaction>(doc)
  );
  return truckTransactions;
};

const createTruckTransaction = async (
  truckTransactionPayload: Omit<TruckTransaction, 'id'>
) => {
  const document = await TransactionModel.create(truckTransactionPayload);
  const truckTransaction = convertDocumentToObject<TruckTransaction>(document);
  return truckTransaction;
};

const editTruckTransaction = async (
  editTruckTransactionPayload: TruckTransaction
) => {
  const document = await TransactionModel.findOneAndUpdate(
    { _id: editTruckTransactionPayload.id },
    editTruckTransactionPayload
  );
  const truckTransaction = convertDocumentToObject<TruckTransaction>(document);
  return truckTransaction;
};

const transactionRepository = {
  getTruckTransactions,
  createTruckTransaction,
  editTruckTransaction,
};

export default transactionRepository;
