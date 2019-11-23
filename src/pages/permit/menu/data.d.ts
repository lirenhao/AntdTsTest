export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface MenuData {
  id: string;
  name: string;
  icon: string;
  path: string;
  locale: string;
  remark: string;
}

export interface QueryData {
  id?: string;
  name?: string;
}

export interface MenuListData {
  list: MenuData[];
  pagination: Partial<Pagination>;
}
