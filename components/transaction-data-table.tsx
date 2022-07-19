import { Table } from 'flowbite-react';
import EditTransactionButton from './edit-transaction-button';
import { DataTableTransaction, TransactionType } from '../types/common';
import DeleteVariousTransactionButton from './truck/delete-various-transaction-button';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableTransaction[];
  hiddenFields?: string[];
}

export default function TransactionDataTable({
  headers,
  data,
  hiddenFields,
}: DataTableProperties) {
  function buildTransactionRow(obj: DataTableTransaction) {
    const tableTransaction: Record<string, string | number | Date | boolean> = {
      ...obj,
    };

    if (hiddenFields) {
      for (const field of hiddenFields) {
        delete tableTransaction[field];
      }
    }

    return (
      <>
        {Object.values(tableTransaction).map((val, i) => (
          <Table.Cell className="whitespace-nowrap" key={`td-${obj.id}-${i}`}>
            {val ? val.toString() : ''}
          </Table.Cell>
        ))}
      </>
    );
  }

  return (
    <>
      <Table hoverable={true}>
        <Table.Head className="whitespace-nowrap">
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell key={index} className={`${columnWidth}`}>
              {header}
            </Table.HeadCell>
          ))}
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((transaction, index) => {
            return (
              <Table.Row key={`tr-${index}`}>
                {buildTransactionRow(transaction)}
                {
                  <Table.Cell className="flex flex-row">
                    <EditTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTransaction={{
                        ...transaction,
                        transactionType: TransactionType.ADDITIONAL_TRANSACTION,
                      }}
                    />
                    <DeleteVariousTransactionButton
                      transactionId={transaction.id}
                    />
                  </Table.Cell>
                }
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
}
