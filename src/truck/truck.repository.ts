import { Truck } from '../../types/common';
import { TruckModel } from './truck.model';
import { Document } from 'mongoose';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const createTruck = async (truckPayload: Omit<Truck, 'id'>) => {
  const truck = await TruckModel.create(truckPayload);
  return convertDocumentToObject<Truck>(truck);
};

const getTrucks = async () => {
  const trucks = await TruckModel.find({});
  return trucks.map((truck) => convertDocumentToObject<Truck>(truck));
};

// const getTruckByTruckId = async (truckId: string) => {
//   const truck = await TruckModel.find({ _id: truckId });
//   console.log(
//     '🚀 ~ file: truck.repository.ts ~ line 20 ~ getTruckByTruckId ~ truck',
//     truck
//   );
//   return convertDocumentToObject<Truck>(truck);
// };
const truckRepository = {
  createTruck,
  getTrucks,
  // getTruckByTruckId,
};

export default truckRepository;
