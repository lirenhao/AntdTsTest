export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ActionData {
  id: string;
  name: string;
  remark: string;
}

export interface QueryData {
  id?: string;
  name?: string;
}

export interface ActionListData {
  list: ActionData[];
  pagination: Partial<Pagination>;
}
