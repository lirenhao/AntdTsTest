import { stringify } from 'qs';
import request from '@/utils/request';
import { ActionData, QueryData } from './data';

export async function find(query: Partial<QueryData>) {
  return request(`/api/action?${stringify(query)}`);
}

export async function save(action: ActionData) {
  return request('/api/action', {
    method: 'POST',
    data: action,
  });
}

export async function update(id: string, action: ActionData) {
  return request(`/api/action/${id}`, {
    method: 'PUT',
    data: action,
  });
}

export async function remove(id: string) {
  return request(`/api/action/${id}`, {
    method: 'DELETE',
  });
}
