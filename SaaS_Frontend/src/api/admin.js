import { api } from './client';

export function createCashier(data) {
  return api('/admin/create-cashier', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
