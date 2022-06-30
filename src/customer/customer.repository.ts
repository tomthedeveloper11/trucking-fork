import { Customer } from '../../types/common';
import { CustomerModel } from './customer.model';
import { Document } from 'mongoose';

const convertDocumentToObject = <T>(document: Document) =>
  document.toObject({ getters: true }) as T;

const createCustomer = async (customerPayload: Omit<Customer, 'id'>) => {
  const customer = await CustomerModel.create(customerPayload);
  return convertDocumentToObject<Customer>(customer);
};

const getCustomers = async () => {
  const customers = await CustomerModel.find({});
  return customers.map((customer: Customer) =>
    convertDocumentToObject<Customer>(customer)
  );
};
const customerRepository = {
  createCustomer,
  getCustomers,
};

export default customerRepository;
