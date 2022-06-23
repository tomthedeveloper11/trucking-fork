import { IDataTableProperties } from '../types/component-props';
import { Table } from 'flowbite-react';
export default function DataTable<T>({
  headers,
  data,
  editableRow,
  onEdit,
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
                    <a
                      href="#"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      onClick={() => {
                        onEdit(entry);
                      }}
                    >
                      Edit
                    </a>
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
