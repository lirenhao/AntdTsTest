import request from '@/utils/request';
import { OrderType, QueryType, DetailsType } from './data';

export async function queryProduct(params: QueryType) {
  return request('/api/order/queryProduct', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryPrice(params: DetailsType) {
  return request('/api/order/queryPrice', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function findProductPrice(id: string) {
  return request(`/api/order/findProductPrice/${id}`);
}

export async function findOrder() {
  return request('/api/order');
}

export async function save(params: OrderType) {
  return request('/api/order', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function update(key: string, params: OrderType) {
  return request(`/api/order/${key}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function remove(key: string) {
  return request(`/api/order/${key}`, {
    method: 'DELETE',
  });
}
