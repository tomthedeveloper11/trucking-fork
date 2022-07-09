export interface DummyData {
  song: string;
  artist: string;
  year: number;
}

export enum TransactionType {
  TRUCK_TRANSACTION = 'TRUCK_TRANSACTION',
  TRUCK_ADDITIONAL_TRANSACTION = 'TRUCK_ADDITIONAL_TRANSACTION',
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
  details: string;
  cost: number;
  transactionType: TransactionType;
  isPrinted: boolean;
}

export interface TruckTransaction extends Transaction {
  truckId: string;
  truckName?: string;
  containerNo: string;
  invoiceNo: string;
  destination: string;
  sellingPrice: number;
  customer: string;
}

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

export interface User {
  id: string;
  username: string;
  password: string;
  email?: string;
  role: string;
  phoneNumber?: string;
}
