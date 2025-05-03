'use client';
import { useState, useEffect } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import Button from '@/components/ui/Button';
import Card from '@/components/layout/Card';
import Divider from '@/components/ui/Divider';
import InputField from '@/components/ui/InputField';
import AdminListItem from '@/components/admin/ListItem';
import EmptyState from '@/components/ui/EmptyState';
import { MdClose, MdPersonAdd, MdSearch } from 'react-icons/md';

interface AdminProps {
  id: string;
  name: string;
  email: string;
  password: string;
}

const emptyAdmin = { name: '', email: '', password: '' } as AdminProps;

const defaultAdmins = [
  {
    id: '1',
    name: 'Ricardo Barrios',
    email: 'ricardo@truenavi.com',
    password: '********',
  },
  {
    id: '2',
    name: 'Gianmarco Gambin',
    email: 'gianmarco@truenavi.com',
    password: '********',
  },
  {
    id: '3',
    name: 'Alex Marquez',
    email: 'alex@truenavi.com',
    password: '********',
  },
  {
    id: '4',
    name: 'Daniel Paez',
    email: 'daniel@truenavi.com',
    password: '********',
  },
];

const AdminComponent = () => {
  const [admins, setAdmins] = useState(defaultAdmins);
  const [editingAdmin, setEditingAdmin] = useState<AdminProps | null>(null);
  const [formData, setFormData] = useState(emptyAdmin);
  const [searchQuery, setSearchQuery] = useState('');

  // reset form when editingAdmin changes or when container view changes
  useEffect(() => {
    setFormData(!editingAdmin ? emptyAdmin : editingAdmin);
  }, [editingAdmin]);

  const handleEditAdmin = (admin: any) => setEditingAdmin(admin);
  const handleAddAdmin = () => setEditingAdmin(emptyAdmin);
  const handleSubmit = () => {
    if (!editingAdmin) return;

    if (editingAdmin === emptyAdmin) {
      const newAdmin = { ...formData, id: Date.now().toString() };
      setAdmins([...admins, newAdmin]);
    } else {
      setAdmins(
        admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin))
      );
    }
    setEditingAdmin(null);
  };

  const handleDeleteAdmin = (adminId: any) => {
    if (window.confirm('are you sure you want to delete this admin?')) {
      setAdmins(admins.filter((admin) => admin.id !== adminId));
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  3;
  const getCardTitle = () => {
    if (!editingAdmin) return `found (${filteredAdmins.length})`;
    if (editingAdmin === emptyAdmin) return 'create';
    return 'edit';
  };

  return (
    <div className="flex-1 gap-4">
      <div className="flex-row items-center gap-3">
        <SearchInput value={searchQuery} onChange={setSearchQuery} className="flex-1" />
        <Button
          onClick={handleAddAdmin}
          variant="secondary"
          icon={<MdPersonAdd className="text-2xl" />}
        />
      </div>

      <Card
        title={getCardTitle()}
        headerRight={
          editingAdmin && (
            <Button
              onClick={() => setEditingAdmin(null)}
              variant="transparent"
              className="!p-0"
              icon={<MdClose className="text-2xl" />}
            />
          )
        }>
        {!editingAdmin ? (
          filteredAdmins.length > 0 ? (
            <div>
              {filteredAdmins.map((admin, index) => (
                <div key={index}>
                  <AdminListItem
                    admin={admin}
                    onEdit={handleEditAdmin}
                    onDelete={handleDeleteAdmin}
                  />
                  {filteredAdmins.length - 1 !== index && <Divider />}
                </div>
              ))}
            </div>
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
              placeholder="password"
              label="password"
            />

            <div className="flex-row gap-3 mt-3">
              <Button onClick={() => setEditingAdmin(null)} variant="danger" fullWidth>
                cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.email || !formData.password}
                variant="tertiary"
                fullWidth>
                {editingAdmin ? 'save changes' : 'add new'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AdminComponent;
