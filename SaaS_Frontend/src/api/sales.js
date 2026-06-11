import { api } from './client';

export function getSales() {
  return api('/sales');
}

export function getSale(id) {
  return api(`/sales/${id}`);
}

export function createSale(data) {
  return api('/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
