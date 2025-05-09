'use client';
import { AdminProps } from '@/services';
import { MdCreate, MdDelete } from 'react-icons/md';

interface AdminItemProps {
  admin: AdminProps;
  onEdit: (admin: AdminProps) => void;
  onDelete: (_id: string) => void;
}

export function ListItem({ admin, onEdit, onDelete }: AdminItemProps) {
  return (
    <div className="flex-row items-center justify-between py-4">
      <div className="gap-1">
        <div className="font-medium text-white">{admin.name}</div>
        <div className="text-sm text-foreground-muted">{admin.email}</div>
      </div>
      <div className="flex-row gap-4">
        <button onClick={() => onEdit(admin)}>
          <MdCreate className="text-2xl text-secondary" />
        </button>
        <button onClick={() => onDelete(admin._id)}>
          <MdDelete className="text-2xl text-danger" />
        </button>
      </div>
    </div>
  );
}
