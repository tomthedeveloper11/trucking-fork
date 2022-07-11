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

import puppeteer from 'puppeteer';
import fs from 'fs-extra';
import hbs from 'handlebars';
import path from 'path';

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

const getGroupedTruckTransactions = async () => {
  const documents = await TransactionModel.find({
    transactionType: TransactionType.TRUCK_TRANSACTION,
  }).sort({ date: -1 });
  const truckTransactions = documents.map((doc) =>
    convertDocumentToObject<TruckTransaction>(doc)
  );

  console.log(truckTransactions);
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

const templatePath = '../../public/templates/';
const tempFilePath = '../../public/temp/';

const compileHandlebars = (data) => {
  const file_path = 'E:/Personal Projects/trucking/public/templates/asd.hbs';
  const html = fs.readFileSync(file_path, 'utf-8');
  return hbs.compile(html)(JSON.parse(JSON.stringify(data)));
};

const printTransaction = async (transactionIds: string[]) => {
  const documents = await TransactionModel.find({
    id: transactionIds[0],
  });
  const truckTransaction = documents.map((doc) =>
    convertDocumentToObject<TruckTransaction>(doc)
  );

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const content = await compileHandlebars(truckTransaction[0]);

  await Promise.all([
    page.setContent(content),
    page.emulateMediaType('screen'),
    page.waitForNavigation({
      waitUntil: 'networkidle0',
    }),
  ]);

  await Promise.all([
    page.pdf({
      path: `${tempFilePath}-asd.pdf`,
      format: 'A4',
      printBackground: true,
    }),
  ]);
  console.log('kepanggil');

  await TransactionModel.updateMany(
    { _id: { $in: transactionIds } },
    { isPrinted: true }
  );
};

const transactionRepository = {
  createTransaction,
  getTruckTransactions,
  getGroupedTruckTransactions,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  createTruckTransaction,
  editTruckTransaction,
  getTruckTransactionAutoComplete,
  printTransaction,
};

export default transactionRepository;
