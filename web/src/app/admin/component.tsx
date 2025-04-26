'use client';
import { useState, useEffect } from 'react';
import { IoMdSearch, IoMdClose, IoMdPersonAdd, IoMdCreate, IoMdTrash } from 'react-icons/io';

const AdminBody = () => {
  const [admins, setAdmins] = useState([
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
  ]);

  const [editingAdmin, setEditingAdmin] = useState<
    | {
        id: string;
        name: string;
        email: string;
        password: string;
      }
    | false
    | null
  >(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Reset form when editingAdmin changes or when container view changes
  useEffect(() => {
    if (!editingAdmin) {
      setFormData({ name: '', email: '', password: '' });
    } else {
      setFormData({
        name: editingAdmin.name,
        email: editingAdmin.email,
        password: editingAdmin.password,
      });
    }
  }, [editingAdmin]);

  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
  };

  const handleAddAdmin = () => {
    setEditingAdmin(false); // Reset for adding a new admin
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert('Validation Error: All fields are required');
      return;
    }

    if (editingAdmin) {
      setAdmins(
        admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin))
      );
    } else {
      const newAdmin = {
        id: Date.now().toString(),
        ...formData,
      };
      setAdmins([...admins, newAdmin]);
    }

    setEditingAdmin(null); // Return to the admin list view after submit
  };

  const handleDeleteAdmin = (adminId: any) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter((admin) => admin.id !== adminId));
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const AdminItem = ({ admin }: any) => {
    return (
      <div className="flex-row justify-between items-center py-4">
        <div className="gap-1">
          <div className="font-medium text-white">{admin.name}</div>
          <div className="text-sm text-foreground-muted">{admin.email}</div>
        </div>
        <div className="flex-row gap-4">
          <button onClick={() => handleEditAdmin(admin)} className="text-secondary">
            <IoMdCreate size={24} />
          </button>
          <button onClick={() => handleDeleteAdmin(admin.id)} className="text-danger">
            <IoMdTrash size={24} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 gap-4 mt-4">
      <div className="flex-row gap-3 items-center">
        <div className="flex-row items-center bg-input rounded-lg px-3 gap-3 h-12 flex-1">
          <IoMdSearch size={22} className="text-icon" />
          <input
            type="text"
            placeholder="search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <IoMdClose size={20} className="text-icon" />
            </button>
          )}
        </div>
        <button onClick={handleAddAdmin} className="bg-btn-secondary p-3 rounded-lg">
          <IoMdPersonAdd size={24} />
        </button>
      </div>
      <div className="bg-container p-6 rounded-xl">
        {/* Display either the list of admins or the form depending on editingAdmin */}
        {editingAdmin === null ? (
          <>
            <h2 className="text-lg font-semibold mb-4">found ({filteredAdmins.length})</h2>

            {filteredAdmins.length > 0 ? (
              <div>
                {filteredAdmins.map((admin, index) => (
                  <div key={index}>
                    <AdminItem admin={admin} />
                    {filteredAdmins.length - 1 !== index && <div className="h-[1px] bg-outline" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 justify-center items-center py-8">
                <IoMdSearch size={48} className="text-icon mb-4" />
                <p className="text-foreground-subtle">no administrators found</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex-row justify-between items-center mb-5">
              <h2 className="text-lg font-semibold">{editingAdmin ? 'edit' : 'create'}</h2>
              <button onClick={() => setEditingAdmin(null)} className="text-white">
                <IoMdClose size={24} />
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="gap-4 mb-2">
              <div className="gap-1.5">
                <label className="text-sm text-white">name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-input p-3 rounded-md text-white"
                  placeholder="admin name"
                />
              </div>

              <div className="gap-1.5">
                <label className="text-sm text-white">email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-input p-3 rounded-md text-white"
                  placeholder="admin@truenavi.com"
                />
              </div>

              <div className="gap-1.5">
                <label className="text-sm text-white">password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-input p-3 rounded-md text-white"
                  placeholder="password"
                />
              </div>

              <div className="flex-row gap-3 mt-3">
                <button
                  onClick={() => setEditingAdmin(null)}
                  className="flex-1 bg-btn-danger p-3 rounded-lg">
                  cancel
                </button>
                <button onClick={handleSubmit} className="flex-1 bg-btn-tertiary p-3 rounded-lg">
                  {editingAdmin ? 'save changes' : 'add new'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBody;
