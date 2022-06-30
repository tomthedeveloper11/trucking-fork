import { Table } from 'flowbite-react';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import { DataTableTruckTransaction, TransactionType } from '../types/common';
import { useRouter } from 'next/router';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableTruckTransaction[];
  hiddenFields?: string[];
  autoCompleteData: Record<string, string[]>;
}

export default function TruckTransactionDataTable({
  headers,
  data,
  hiddenFields,
  autoCompleteData,
}: DataTableProperties) {
  function buildTransactionRow(obj: DataTableTruckTransaction) {
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
          {data.map((truckTransaction, index) => {
            const truckId = truckTransaction.truckId || querytruckId;

            return (
              <Table.Row key={`tr-${index}`}>
                {buildTransactionRow(truckTransaction)}
                {
                  <Table.Cell>
                    <EditTruckTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTruckTransaction={{
                        ...truckTransaction,
                        transactionType: TransactionType.TRUCK_TRANSACTION,
                        truckId,
                      }}
                      autoCompleteData={autoCompleteData}
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
