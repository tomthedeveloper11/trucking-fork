import mongoose, { Schema } from 'mongoose';
import { Truck } from '../../types/common';

const truckSchema = new Schema<Truck>(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  { versionKey: false }
);

export const TruckModel =
  mongoose.models.truck || mongoose.model<Truck>('truck', truckSchema);
