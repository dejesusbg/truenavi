import { api } from '@/services/api';
import { AdminResponse } from '@/services/types';

export async function getAdmins() {
  return await api.get<AdminResponse>('admin');
}

export async function updateAdmin(_id: string, name: string, email: string, password: string) {
  return await api.put<AdminResponse>(`admin/${_id}`, { name, email, password });
}

export async function deleteAdmin(_id: string) {
  return await api.del<AdminResponse>(`admin/${_id}`);
}
