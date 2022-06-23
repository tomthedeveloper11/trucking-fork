export interface IDataTableProperties<T> {
  headers: Record<string, string>;
  data: T[];
  editableRow: boolean;
  onEdit: (_: T) => void;
}
