export interface GridFilter {
  pageSize: number;
  backend: string;
  page: number;
  params?: any;
}
export interface GridResult<T> {
  totalPages: number;
  totalItems: number;
  page: number;
  pageSize: number;
  items: T[];
}
