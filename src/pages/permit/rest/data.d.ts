export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface RestData {
  id: string;
  remark: string;
}

export interface QueryData {
  id?: string;
}

export interface RestListData {
  list: RestData[];
  pagination: Partial<Pagination>;
}