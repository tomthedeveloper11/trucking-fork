export interface DummyData {
  song: string;
  artist: string;
  year: number;
}

export enum TransactionType {
  TRUCK_TRANSACTION = 'TRUCK_TRANSACTION',
  TRUCK_ADDITIONAL_TRANSACTION = 'TRUCK_ADDITIONAL_TRANSACTION',
}

export interface Truck {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Transaction {
  date: Date;
  details: string;
  cost: number;
  transactionType: TransactionType;
}

export interface TruckTransaction extends Transaction {
  containerNo: string;
  invoiceNo: string;
  destination: string;
  price: number;
  customer: string;
}
