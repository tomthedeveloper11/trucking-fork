export enum TransactionType {
  TRUCK_TRANSACTION = 'TRUCK_TRANSACTION',
  TRUCK_ADDITIONAL_TRANSACTION = 'TRUCK_ADDITIONAL_TRANSACTION',
  ADDITIONAL_TRANSACTION = 'ADDITIONAL_TRANSACTION',
}

export interface Customer {
  id: string;
  initial: string;
  name?: string;
  address?: string;
}

export interface Truck {
  id: string;
  name: string;
  licenseNumber?: string;
}

export interface Transaction {
  id: string;
  date: Date | string;
  details?: string;
  cost: number;
  transactionType: TransactionType;
}

export interface TruckTransaction extends Transaction {
  truckId: string;
  truckName?: string;
  containerNo: string;
  invoiceNo: string;
  destination: string;
  sellingPrice: number;
  customer: string;
  bon: string;
  isPrintedBon: boolean;
  isPrintedInvoice: boolean;
}

export interface AdditionalTruckTransaction extends Transaction {
  truckId: string;
}

export type DataTableTransaction = Omit<Transaction, 'transactionType'>;

export type DataTableAdditionalTransaction = Omit<
  AdditionalTruckTransaction,
  'transactionType'
>;

export type DataTableTruckTransaction = Omit<
  TruckTransaction,
  'transactionType'
>;
export type TruckTransactionPayload = Omit<
  TruckTransaction,
  'id' | 'customer'
> & {
  customer: {
    customerId: string;
    initial: string;
  };
};

export type EditTruckTransactionPayload = Omit<TruckTransaction, 'customer'> & {
  customer: {
    customerId: string;
    initial: string;
  };
};

export type UITruckTransaction = TruckTransaction & { selected: boolean };

export interface FilterTransactionsQuery {
  customer: string;
  startDate?: string;
  endDate?: string;
  containerNo?: string;
  invoiceNo?: string;
  destination?: string;
}

export interface TransactionSummaryQuery {
  month: string;
  year: string;
}

export interface TransactionSummary {
  [truckName: string]: {
    truckId: string;
    cost: number;
    sellingPrice: number;
    margin: number;
  };
}

export interface TotalSummary {
  cost: number;
  sellingPrice: number;
  margin: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  role: string;
  phoneNumber?: string;
}
