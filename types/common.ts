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
  id: string;
  date: Date | string;
  details: string;
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
}
