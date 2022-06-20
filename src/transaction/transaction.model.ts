import mongoose, { Schema } from 'mongoose';
import { TransactionType } from '../../types/common';

const transactionSchema = new Schema<any>(
  {
    date: {
      type: Date,
      required: true,
      default: new Date(),
    },
    details: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    containerNo: {
      type: String,
    },
    invoiceNo: {
      type: String,
    },
    destination: {
      type: String,
    },
    sellingPrice: {
      type: Number,
    },
    customer: {
      type: String,
    },
  },
  { versionKey: false }
);

export const TransactionModel =
  mongoose.models.transaction ||
  mongoose.model<any>('transaction', transactionSchema);
