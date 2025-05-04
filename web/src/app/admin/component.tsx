'use client';
import { useState, useEffect } from 'react';
import { MdClose, MdPersonAdd, MdSearch } from 'react-icons/md';
import { Card, Button, SearchInput, Divider, InputField, ListItem, EmptyState } from '@/components';
import { AdminProps, deleteAdmin, getAllAdmins, updateAdmin } from '@/services/admin';
import { handleAuth, registerUser } from '@/services/auth';

export const initialForm: AdminProps = { _id: '', name: '', email: '', password: '' };
type appState = 'view' | 'edit' | 'create';

const AdminComponent = () => {
  handleAuth();

  const [admins, setAdmins] = useState<AdminProps[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mode, setMode] = useState<appState>('view');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdmins = async () => {
    const res = await getAllAdmins();
    if (res.success && res.data) setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleEdit = (admin: AdminProps) => {
    setFormData({ ...admin, password: '' });
    setCurrentId(admin._id!);
    setMode('edit');
  };

  const handleCreate = () => {
    setFormData(initialForm);
    setCurrentId(null);
    setMode('create');
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setCurrentId(null);
    setMode('view');
  };

  const handleSubmit = async () => {
    const { name, email, password } = formData;

    let res;
    if (mode === 'create') {
      res = await registerUser(name, email, password);
    } else if (mode === 'edit' && currentId) {
      res = await updateAdmin(currentId, name, email, password);
    }

    if (res?.success) {
      await fetchAdmins();
      handleCancel();
    }
  };

  const handleDelete = async (_id: string) => {
    if (confirm('are you sure you want to delete this admin?')) {
      await deleteAdmin(_id);
      await fetchAdmins();
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formValid =
    formData.name.trim() && formData.email.trim() && (mode === 'edit' || formData.password.trim());

  return (
    <div className="flex-1 gap-4">
      <div className="flex-row items-center gap-3">
        <SearchInput value={searchQuery} onChange={setSearchQuery} className="flex-1" />
        <Button
          onClick={handleCreate}
          variant="secondary"
          icon={<MdPersonAdd className="text-2xl" />}
        />
      </div>

      <Card
        title={mode === 'view' ? `found (${filteredAdmins.length})` : mode}
        headerRight={
          mode !== 'view' && (
            <Button
              onClick={handleCancel}
              variant="transparent"
              className="!p-0"
              icon={<MdClose className="text-2xl" />}
            />
          )
        }>
        {mode === 'view' ? (
          filteredAdmins.length ? (
            filteredAdmins.map((admin, index) => (
              <div key={admin._id}>
                <ListItem admin={admin} onEdit={handleEdit} onDelete={handleDelete} />
                {filteredAdmins.length - 1 !== index && <Divider />}
              </div>
            ))
          ) : (
            <EmptyState icon={<MdSearch />} message="no administrators found" />
          )
        ) : (
          <form onSubmit={(e) => e.preventDefault()} className="gap-4 pt-2 pb-4">
            <InputField
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="admin name"
              label="name"
            />

            <InputField
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@truenavi.com"
              label="email"
            />

            <InputField
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={mode === 'edit' ? 'leave blank to keep current password' : 'password'}
              label="password"
            />

            <div className="flex-row gap-3 mt-3">
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!formValid}
                variant="secondary"
                fullWidth>
                {mode === 'create' ? 'add new' : 'save changes'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminComponent;
