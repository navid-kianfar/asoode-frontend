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

export interface GridCommand<T> {
  data?: T;
  reload?: boolean;
  nextPage?: boolean;
  prevPage?: boolean;
  firstPage?: boolean;
  lastPage?: boolean;
  goToPage?: number;
}
