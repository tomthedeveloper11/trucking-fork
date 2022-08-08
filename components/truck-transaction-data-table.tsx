import { Table } from 'flowbite-react';
import EditTruckTransactionButton from './truck/edit-truck-transaction-button';
import {
  DataTableTruckTransaction,
  TransactionType,
  UITruckTransaction,
} from '../types/common';
import React, { useEffect, useState } from 'react';
import { PrinterIcon } from '@heroicons/react/solid';
import truckTransactionBloc from '../lib/truckTransaction';
import DeleteVariousTransactionButton from './delete-various-transaction-button';
import { useToastContext } from '../lib/toast-context';
import { useRouterRefresh } from '../hooks/hooks';
import { getCookie } from 'cookies-next';
import * as jwt from 'jsonwebtoken';

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
        <Table.Cell className="px-0 text-center" key={`td-${obj.id}-${i}`}>
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
  const access_token = getCookie('access_token');
  const user = jwt.decode(access_token, process.env.SECRET_KEY);

  const refreshData = useRouterRefresh();
  const addToast = useToastContext();
  const [truckTransactions, setTruckTransactions] = useState(
    prepareTruckTransactions(data)
  );

  useEffect(() => {
    setTruckTransactions(prepareTruckTransactions(data));
  }, [data]);

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
      addToast('Mohon coba kembali');
    }

    refreshData();
  }

  const totalCost = data.reduce((acc, obj) => acc + obj.cost, 0);
  const totalSell = data.reduce((acc, obj) => acc + obj.sellingPrice, 0);

  return (
    <>
      <Table>
        <Table.Head className="whitespace-nowrap">
          {emkl && user?.role !== 'guest' && (
            <Table.HeadCell className="text-center">Print</Table.HeadCell>
          )}
          {Object.entries(headers).map(([header, columnWidth], index) => (
            <Table.HeadCell
              key={index}
              className={`${columnWidth} px-3 text-center`}
            >
              {header}
            </Table.HeadCell>
          ))}
          {user?.role !== 'guest' && <Table.HeadCell>Actions</Table.HeadCell>}
        </Table.Head>
        <Table.Body className="divide-y">
          {data.map((truckTransaction, index) => {
            return (
              <Table.Row
                key={`tr-${index}`}
                className={`${
                  truckTransactions[index]?.selected &&
                  'bg-green-100 hover:bg-green-200'
                } hover:bg-gray-100`}
              >
                {emkl && user?.role !== 'guest' && (
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
                          className={`flex my-1 border border-gray-300 rounded shadow-sm px-2 ${
                            truckTransaction.isPrintedBon
                              ? 'text-gray-600 hover:bg-white'
                              : 'bg-green-400 hover:bg-green-500 text-gray-100'
                          }`}
                          onClick={() =>
                            print(truckTransactions[index].id, 'bon')
                          }
                        >
                          <PrinterIcon className="h-5 mt-1" />
                          <p className={`text-lg font-bold`}>Bon</p>
                        </button>

                        <button
                          className={`flex my-1 border border-gray-300 rounded shadow-sm px-2 ${
                            truckTransaction.isPrintedInvoice
                              ? 'text-gray-600 hover:bg-white'
                              : 'bg-green-400 hover:bg-green-500 text-gray-100'
                          }`}
                          onClick={() =>
                            print(truckTransactions[index].id, 'tagihan')
                          }
                        >
                          <PrinterIcon className="h-5 mt-1" />
                          <p className={`text-lg font-bold`}>Tagihan</p>
                        </button>
                      </div>
                    </div>
                  </Table.Cell>
                )}
                {buildTransactionRow(truckTransaction, hiddenFields)}
                {truckTransactions[index] && user?.role !== 'guest' && (
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
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      {totalCost != 0 && totalSell != 0 && (
        <div className="mt-5 pl-[39.5vw] border flex gap-8">
          <p className="text-lg font-bold">{totalCost}</p>
          <p className="text-lg font-bold">{totalSell}</p>
        </div>
      )}
    </>
  );
}
