import axios from 'axios';
import { Customer } from '../types/common';

const getCustomers = async () => {
  const response = await axios({
    method: 'GET',
    url: 'http://localhost:3000/api/customer',
  });
  if (response && response.data) {
    return response.data.data as Customer[];
  }
  return [];
};

const getCustomerByCustomerId = async (customerId: string) => {
  const response = await axios({
    method: 'GET',
    url: `http://localhost:3000/api/customer/${customerId}`,
  });
  if (response && response.data) {
    return response.data.data as Customer;
  }
  return [];
};

const customerBloc = { getCustomers, getCustomerByCustomerId };

export default customerBloc;
