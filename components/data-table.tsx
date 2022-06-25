import { Table } from 'flowbite-react';
import EditTruckTransactionButton from '../components/truck/edit-truck-transaction-button';
import { TransactionType, TruckTransaction } from '../types/common';
import { useRouter } from 'next/router';

interface IDataTableProperties<T> {
  headers: Record<string, string>;
  data: T[];
  editableRow: boolean;
  hiddenFields?: string[];
}

export default function DataTable<T>({
  headers,
  data,
  editableRow,
  hiddenFields,
}: IDataTableProperties<T>) {
  function isTruckTransaction(object: any): object is TruckTransaction {
    return 'containerNo' in object;
  }

  function buildTransactionRow(obj: T) {
    const output = {};

    for (const [key, value] of Object.entries(obj)) {
      if (!hiddenFields?.includes(key)) {
        output[key] = value;
      }
    }
    console.log(output, '<<<<<<<');
    return output;
  }

  const { id: truckId } = useRouter().query;
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
                {Object.values(buildTransactionRow(entry)).map((val, i) => (
                  <Table.Cell key={`td-${index}-${i}`} className="">
                    {val}
                  </Table.Cell>
                ))}
                {editableRow && isTruckTransaction(entry) ? (
                  <Table.Cell>
                    <EditTruckTransactionButton
                      key={`edit-modal-key${index}`}
                      existingTruckTransaction={{
                        ...entry,
                        transactionType: TransactionType.TRUCK_TRANSACTION,
                        truckId,
                      }}
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
