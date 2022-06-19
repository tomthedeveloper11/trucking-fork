import { IDataTableProperties } from '../types/component-props';
export default function DataTable<T>({
  headers,
  data,
}: IDataTableProperties<T>) {
  return (
    <>
      <table className="table-fixed border-collapse w-full text-sm divide-y bg-white">
        <thead className="bg-white">
          <tr>
            {Object.entries(headers).map(([header, columnWidth], index) => (
              <th key={index} className={`${columnWidth} capitalize text-left`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((entry, index) => {
            return (
              <tr key={`tr-${index}`}>
                {Object.values(entry).map((val, i) => (
                  <td key={`td-${index}-${i}`} className="">
                    {val}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
