import request from '@/utils/request';
import { ProductListParams, Product, ProductPrice } from './data';

export async function queryProduct(params: ProductListParams) {
  return request('/api/product', {
    params,
  });
}

export async function saveProduct(params: Product) {
  return request('/api/product', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateProduct(id: string, params: Product) {
  return request(`/api/product/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function removeProduct(id: string) {
  return request(`/api/product/${id}`, {
    method: 'DELETE',
  });
}

export async function queryPrice(id: string) {
  return request(`api/productPrice/${id}`);
}

export async function savePrice(id: string, params: ProductPrice) {
  return request(`api/productPrice/${id}`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}