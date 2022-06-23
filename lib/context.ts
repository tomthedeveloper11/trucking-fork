import React from 'react';
import { Truck } from '../types/common';

export const TruckContext = React.createContext<Omit<Truck, 'id'>[]>([]);
