export interface IDataTableProperties<T> {
  headers: Record<string, string>;
  data: T[];
  editableRow: boolean;
}
