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

const getCustomerByCustomerId = async (customerId: string) => {
  const customer = await customerRepository.getCustomerByCustomerId(customerId);
  return customer;
};

const customerService = {
  createCustomer,
  getCustomers,
  getCustomerByCustomerId,
};

export default customerService;
