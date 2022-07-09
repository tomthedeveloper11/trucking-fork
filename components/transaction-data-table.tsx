import { Table } from 'flowbite-react';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import { DataTableTransaction, TransactionType } from '../types/common';
import { useRouter } from 'next/router';

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
            {val}
          </Table.Cell>
        ))}
      </>
    );
  }

  const { id: querytruckId } = useRouter().query;
  return (
    <>
      <Table hoverable={true}>
        <Table.Head className="whitespace-nowrap">
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell key={index} className={`${columnWidth}`}>
              {header}
            </Table.HeadCell>
          ))}
          <Table.HeadCell>Edit</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((transaction, index) => {
            const truckId = transaction.truckId || querytruckId;

            return (
              <Table.Row key={`tr-${index}`}>
                {buildTransactionRow(transaction)}
                {
                  <Table.Cell>
                    {/* <EditTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTransaction={{
                        ...transaction,
                        transactionType: TransactionType.TRUCK_TRANSACTION,
                        truckId,
                      }}
                      autoCompleteData={autoCompleteData}
                    /> */}
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
