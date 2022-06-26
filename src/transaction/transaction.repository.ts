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

const getTruckTransactionAutoComplete = async (): Promise<
  Record<string, string[]>
> => {
  const fields = ['destination', 'customer'];
  const [destinations, customers] = await Promise.all(
    fields.map((field) =>
      TransactionModel.distinct(field, {
        type: TransactionType.TRUCK_TRANSACTION,
      })
    )
  );
  const result = {
    destination: destinations.filter((_) => _),
    customer: customers.filter((_) => _),
  };
  return result;
};

const transactionRepository = {
  getTruckTransactions,
  createTruckTransaction,
  editTruckTransaction,
  getTruckTransactionAutoComplete,
};

export default transactionRepository;
