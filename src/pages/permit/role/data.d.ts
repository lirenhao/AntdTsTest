export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface RoleData {
  id: string;
  name: string;
  remark: string;
}

export interface QueryData {
  id?: string;
  name?: string;
}

export interface RoleListData {
  list: RoleData[];
  pagination: Partial<Pagination>;
}
