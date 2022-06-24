import { IDataTableProperties } from '../types/component-props';
import { Table } from 'flowbite-react';
import EditTruckTransactionButton from '../components/truck/edit-truck-transaction-button';
import { TransactionType } from '../types/common';

export default function DataTable<T>({
  headers,
  data,
  editableRow,
}: IDataTableProperties<T>) {
  return (
    <>
      <Table hoverable={true}>
        <Table.Head>
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell key={index} className={`${columnWidth}`}>
              {header}
            </Table.HeadCell>
          ))}
          {editableRow ? <Table.HeadCell>Edit</Table.HeadCell> : null}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((entry, index) => {
            return (
              <Table.Row key={`tr-${index}`}>
                {Object.values(entry).map((val, i) => (
                  <Table.Cell key={`td-${index}-${i}`} className="">
                    {val}
                  </Table.Cell>
                ))}
                {editableRow ? (
                  <Table.Cell>
                    <EditTruckTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTruckTransaction={{
                        ...entry,
                        transactionType:
                          TransactionType.TRUCK_ADDITIONAL_TRANSACTION,
                      }}
                      truckId="asd"
                    />
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
