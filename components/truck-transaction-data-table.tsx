import { Table, Checkbox } from 'flowbite-react';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import {
  DataTableTruckTransaction,
  TransactionType,
  TruckTransaction,
  UITruckTransaction,
} from '../types/common';
import React, { useState } from 'react';
import { PrinterIcon } from '@heroicons/react/solid';
import truckTransactionBloc from '../lib/truckTransaction';
import DeleteVariousTransactionButton from './truck/delete-various-transaction-button';
import { useToastContext } from '../lib/toast-context';

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
        <Table.Cell className="px-4 text-center" key={`td-${obj.id}-${i}`}>
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
  const addToast = useToastContext();
  const baseTruckTransactions: TruckTransaction[] = [];
  const [truckTransactions, setTruckTransactions] = useState(
    prepareTruckTransactions(data)
  );

  async function print(truckTransactionId: string, type: string) {
    addToast('Loading...');

    const markedTransactions = truckTransactions
      .filter((t) => t.selected)
      .map((t) => t.id);
    const transactionIds =
      markedTransactions.length > 0 ? markedTransactions : [truckTransactionId];
    const response = await truckTransactionBloc.printTransactions(
      transactionIds,
      type
    );

    if (response === 'Print Success') {
      addToast('Print Success');
    } else {
      addToast('Please Try Again');
    }
  }

  return (
    <>
      <Table>
        <Table.Head className="whitespace-nowrap">
          {emkl && (
            <Table.HeadCell className="text-center">Print</Table.HeadCell>
          )}
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell
              key={index}
              className={`${columnWidth} px-4 text-center`}
            >
              {header}
            </Table.HeadCell>
          ))}
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {data &&
            data.map((truckTransaction, index) => {
              return (
                <Table.Row
                  key={`tr-${index}`}
                  className={`${
                    truckTransactions[index]?.selected &&
                    'bg-green-100 hover:bg-green-200'
                  } hover:bg-gray-100`}
                >
                  {emkl && (
                    <Table.Cell>
                      <div className="flex gap-3">
                        <input
                          className="mt-7 rounded checked:bg-green-400 checked:border-green-400 focus:ring-green-500"
                          type="checkbox"
                          onClick={() => {
                            truckTransactions[index].selected =
                              !truckTransactions[index].selected;
                            setTruckTransactions([...truckTransactions]);
                          }}
                        ></input>
                        <div>
                          <button
                            className="flex my-1 border border-gray-300 rounded shadow-sm px-2 hover:bg-white"
                            onClick={() =>
                              print(truckTransactions[index].id, 'bon')
                            }
                          >
                            <PrinterIcon className="h-5 mt-1" />
                            <p
                              className={`text-lg font-bold ${
                                truckTransaction.isPrintedBon
                                  ? 'text-orange-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              Bon
                            </p>
                          </button>

                          <button
                            className="flex my-1 border border-gray-300 rounded shadow-sm px-2 hover:bg-white"
                            onClick={() =>
                              print(truckTransactions[index].id, 'tagihan')
                            }
                          >
                            <PrinterIcon className="h-5 mt-1" />
                            <p
                              className={`text-lg font-bold ${
                                truckTransaction.isPrintedInvoice
                                  ? 'text-green-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              Tagihan
                            </p>
                          </button>
                        </div>
                      </div>
                    </Table.Cell>
                  )}
                  {buildTransactionRow(truckTransaction, hiddenFields)}
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
                        disabled={truckTransactions[index]?.selected}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </>
  );
}
