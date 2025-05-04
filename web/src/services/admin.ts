import { api, Response } from '@/utils/api';

export interface AdminProps {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export type AdminResponse = Response<AdminProps>;

export async function getAllAdmins() {
  try {
    return await api.get<AdminResponse>('admin');
  } catch (error) {
    console.error('[Admin] Error during fetching:', error);
    return { success: false, error: 'Fetching failed. Please try again.', data: [] };
  }
}

export async function updateAdmin(_id: string, name: string, email: string, password: string) {
  try {
    return await api.put<AdminResponse>(`admin/${_id}`, { name, email, password });
  } catch (error) {
    console.error('[Admin] Error during updating:', error);
    return { success: false, error: 'Updating failed. Please try again.' };
  }
}

export async function deleteAdmin(_id: string) {
  try {
    return await api.del<AdminResponse>(`admin/${_id}`);
  } catch (error) {
    console.error('[Admin] Error during deleting:', error);
    return { success: false, error: 'Deleting failed. Please try again.' };
  }
}
