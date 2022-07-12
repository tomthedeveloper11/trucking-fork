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
import truckTransactionBloc from '../lib/truckTransactions';

interface DataTableProperties {
  headers: Record<string, string>;
  data: DataTableTruckTransaction[];
  hiddenFields?: string[];
  autoCompleteData: Record<string, string[]>;
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
        <Table.Cell className="whitespace-nowrap" key={`td-${obj.id}-${i}`}>
          {val}
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
}: DataTableProperties) {
  const baseTruckTransactions: TruckTransaction[] = [];
  const [truckTransactions, setTruckTransactions] = useState(
    prepareTruckTransactions(data)
  );

  function print(truckTransactionId: string) {
    const markedTransactions = truckTransactions
      .filter((t) => t.selected)
      .map((t) => t.id);
    const transactionIds =
      markedTransactions.length > 0 ? markedTransactions : [truckTransactionId];
    truckTransactionBloc.printTransactions(transactionIds);
  }

  return (
    <>
      <Table hoverable={true}>
        <Table.Head className="whitespace-nowrap">
          <Table.HeadCell></Table.HeadCell>
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
              <Table.Row key={`tr-${index}`}>
                <Table.Cell>
                  <Checkbox
                    onClick={() => {
                      truckTransactions[index].selected =
                        !truckTransactions[index].selected;
                      setTruckTransactions([...truckTransactions]);
                    }}
                  ></Checkbox>
                </Table.Cell>
                {buildTransactionRow(truckTransaction, hiddenFields)}
                {
                  <Table.Cell>
                    <div className="flex flex-row">
                      <EditTruckTransactionButton
                        key={`edit-modal-key${index}`}
                        existingTruckTransaction={truckTransactions[index]}
                        autoCompleteData={autoCompleteData}
                        disabled={truckTransactions[index].selected}
                      />
                      <PrinterIcon
                        className="cursor-pointer"
                        onClick={() => print(truckTransactions[index].id)}
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
