import React from 'react';
import { Truck } from '../types/common';
const TruckContext = React.createContext<Omit<Truck, 'id'>[]>([]);

export default TruckContext;
