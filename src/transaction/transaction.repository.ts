import { indexPlusOne } from './../../helpers/hbsHelpers';
import {
  EditTruckTransactionPayload,
  TransactionType,
  TruckTransaction,
  TruckTransactionPayload,
  AdditionalTruckTransaction,
  TransactionSummaryQuery,
  FilterTransactionsQuery,
} from '../../types/common';
import { TransactionModel } from './transaction.model';
import { Document } from 'mongoose';
import _ from 'lodash';
import { CustomerModel } from '../customer/customer.model';
import fs from 'fs';
import puppeteer from 'puppeteer';
import handlers from 'handlebars';
import moment from 'moment';

import { formatRupiah, formatDate } from '../../helpers/hbsHelpers';

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

const getAllTransactions = async ({
  year = new Date().getFullYear().toString(),
  month = (new Date().getMonth() + 1).toString(),
}: TransactionSummaryQuery) => {
  const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
  const endDate = moment(`${year}-${month}-01`).endOf('month').toDate();
  const documents = await TransactionModel.find({
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  });
  const allTransactions = documents.map((doc) =>
    convertDocumentToObject<TruckTransaction>(doc)
  );

  return allTransactions;
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

const createAdditionalTruckTransaction = async (
  transactionPayload: AdditionalTruckTransaction
) => {
  const document = await TransactionModel.create(transactionPayload);
  const transaction =
    convertDocumentToObject<AdditionalTruckTransaction>(document);
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

const editAdditionalTruckTransaction = async (
  editAdditionalTruckTransactionPayload: AdditionalTruckTransaction
) => {
  const document = await TransactionModel.findOneAndUpdate(
    { _id: editAdditionalTruckTransactionPayload.id },
    editAdditionalTruckTransactionPayload
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
  handlers.registerHelper('formatRupiah', formatRupiah);
  handlers.registerHelper('formatDate', formatDate);
  handlers.registerHelper('indexPlusOne', indexPlusOne);

  const documents = await TransactionModel.find({
    _id: { $in: transactionIds },
  });

  const truckTransactions = documents.map((doc) => mapTruckTransaction(doc));
  console.log(
    '🚀 ~ file: transaction.repository.ts ~ line 147 ~ printTransaction ~ truckTransactions',
    truckTransactions
  );

  const content = {
    main: {
      currentDate: new Date(),
      customerName: truckTransactions[0].customer,
    },
    transactions: truckTransactions,
  };

  // read our invoice-template.html file using node fs module
  const file = fs.readFileSync('./bon.html', 'utf8');

  // compile the file with handlebars and inject the customerName variable
  const template = handlers.compile(`${file}`);
  const html = template(content);

  // simulate a chrome browser with puppeteer and navigate to a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // set our compiled html template as the pages content
  // then waitUntil the network is idle to make sure the content has been loaded
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // convert the page to pdf with the .pdf() method
  const pdf = await page.pdf({ format: 'A4' });

  await TransactionModel.updateMany(
    { _id: { $in: transactionIds } },
    { isPrinted: true }
  );

  return pdf;
};

const filterTruckTransactions = async (query: FilterTransactionsQuery) => {
  // TODO
};

const transactionRepository = {
  createAdditionalTruckTransaction,
  getTruckTransactions,
  getAllTransactions,
  getTruckTransactionsByCustomerId,
  getTruckTransactionsByTruckId,
  getMiscTruckTransactionsByTruckId,
  createTruckTransaction,
  editTruckTransaction,
  editAdditionalTruckTransaction,
  getTruckTransactionAutoComplete,
  printTransaction,
  filterTruckTransactions,
};

export default transactionRepository;
