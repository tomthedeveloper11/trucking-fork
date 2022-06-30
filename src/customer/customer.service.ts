import { Customer } from '../../types/common';
import customerRepository from './customer.repository';

const createCustomer = async (customerPayload: Omit<Customer, 'id'>) => {
  const newCustomer = await customerRepository.createCustomer(customerPayload);
  return newCustomer;
};

const getCustomers = async () => {
  const customers = await customerRepository.getCustomers();
  return customers;
};

const customerService = {
  createCustomer,
  getCustomers,
};

export default customerService;
