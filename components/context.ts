import React from 'react';
import { Truck } from '../types/common';
const baseTruck: Omit<Truck, 'id'> = { name: '', imageUrl: '' };
const TruckContext = React.createContext<Omit<Truck, 'id'>>(baseTruck);

export default TruckContext;
