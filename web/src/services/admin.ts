import { api, Response } from '@/utils/api';

export interface AdminProps {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type AdminResponse = Response<AdminProps[]>;

export async function getAllAdmins() {
  return await api.get<AdminResponse>('admin');
}

export async function updateAdmin(_id: string, name: string, email: string, password: string) {
  return await api.put<AdminResponse>(`admin/${_id}`, { name, email, password });
}

export async function deleteAdmin(_id: string) {
  return await api.del<AdminResponse>(`admin/${_id}`);
}
