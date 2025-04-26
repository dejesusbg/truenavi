import Header from '@/components/layout/Header';
import AdminBody from '@/app/admin/component';

const AdminPage = () => {
  return (
    <>
      <Header
        title="admin"
        icons={[
          { name: 'FaMap', href: 'map' },
          { name: 'FaSignInAlt', href: 'login' },
        ]}
        goBack={true}
      />
      <AdminBody />
    </>
  );
};

export default AdminPage;
