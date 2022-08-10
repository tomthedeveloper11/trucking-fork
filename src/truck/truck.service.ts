import { Truck } from '../../types/common';
import truckRepository from './truck.repository';

const createTruck = async (truckPayload: Omit<Truck, 'id'>) => {
  const newTruck = await truckRepository.createTruck(truckPayload);
  return newTruck;
};

const getTrucks = async () => {
  const trucks = await truckRepository.getTrucks();
  return trucks;
};

const getTruckByTruckId = async (truckId: string) => {
  const truck = await truckRepository.getTruckByTruckId(truckId);
  return truck;
};

const truckService = {
  createTruck,
  getTrucks,
  getTruckByTruckId,
};

export default truckService;
