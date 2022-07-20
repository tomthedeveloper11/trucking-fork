import { Table, Checkbox } from 'flowbite-react';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import {
  DataTableTruckTransaction,
  TransactionType,
  TruckTransaction,
  UITruckTransaction,
} from '../types/common';
import React, { useState } from 'react';
import { PrinterIcon, TrashIcon } from '@heroicons/react/solid';
import truckTransactionBloc from '../lib/truckTransaction';
import { formatRupiah } from '../helpers/hbsHelpers';
import DeleteVariousTransactionButton from './truck/delete-various-transaction-button';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableTruckTransaction[];
  hiddenFields?: string[];
  autoCompleteData: Record<string, string[]>;
  emkl?: boolean;
}

function buildTransactionRow(
  obj: DataTableTruckTransaction,
  hiddenFields?: string[]
) {
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
        <Table.Cell className="pr-4" key={`td-${obj.id}-${i}`}>
          {val ? val.toString() : ''}
        </Table.Cell>
      ))}
    </>
  );
}

function prepareTruckTransactions(
  dataTableTruckTransaction: DataTableTruckTransaction[]
): UITruckTransaction[] {
  return dataTableTruckTransaction.map((t: DataTableTruckTransaction) => {
    return {
      ...t,
      transactionType: TransactionType.TRUCK_TRANSACTION,
      selected: false,
    };
  });
}

export default function TruckTransactionDataTable({
  headers,
  data,
  hiddenFields,
  autoCompleteData,
  emkl = false,
}: DataTableProperties) {
  const baseTruckTransactions: TruckTransaction[] = [];
  const [truckTransactions, setTruckTransactions] = useState(
    prepareTruckTransactions(data)
  );

  function print(truckTransactionId: string, type: string) {
    const markedTransactions = truckTransactions
      .filter((t) => t.selected)
      .map((t) => t.id);
    const transactionIds =
      markedTransactions.length > 0 ? markedTransactions : [truckTransactionId];
    truckTransactionBloc.printTransactions(transactionIds, type);
  }

  return (
    <>
      <Table>
        <Table.Head className="whitespace-nowrap">
          {emkl && <Table.HeadCell>Print</Table.HeadCell>}
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell key={index} className={`${columnWidth}`}>
              {header}
            </Table.HeadCell>
          ))}
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((truckTransaction, index) => {
            return (
              <Table.Row
                key={`tr-${index}`}
                className={`${
                  truckTransactions[index].selected &&
                  'bg-green-100 hover:bg-green-200'
                } hover:bg-gray-100`}
              >
                {emkl && (
                  <Table.Cell>
                    <div className="grid grid-cols-3 gap-6">
                      <input
                        className="mt-2 rounded checked:bg-green-400 checked:border-green-400 focus:ring-green-500"
                        type="checkbox"
                        onClick={() => {
                          truckTransactions[index].selected =
                            !truckTransactions[index].selected;
                          setTruckTransactions([...truckTransactions]);
                        }}
                      ></input>
                      <button
                        className={`text-xl font-bold ${
                          truckTransaction.isPrintedBon
                            ? 'text-orange-600'
                            : 'text-gray-200'
                        }`}
                        onClick={() =>
                          print(truckTransactions[index].id, 'bon')
                        }
                      >
                        B
                      </button>
                      <button
                        className={`text-xl font-bold ${
                          truckTransaction.isPrintedInvoice
                            ? 'text-green-600'
                            : 'text-gray-200'
                        }`}
                        onClick={() =>
                          print(truckTransactions[index].id, 'tagihan')
                        }
                      >
                        T
                      </button>
                    </div>
                  </Table.Cell>
                )}
                {buildTransactionRow(truckTransaction, hiddenFields)}
                {
                  <Table.Cell>
                    <div className="flex flex-row">
                      <EditTruckTransactionButton
                        key={`edit-modal-key${index}`}
                        existingTruckTransaction={truckTransactions[index]}
                        autoCompleteData={autoCompleteData}
                        disabled={truckTransactions[index]?.selected}
                      />
                      <DeleteVariousTransactionButton
                        transactionId={truckTransaction.id}
                      />
                    </div>
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
