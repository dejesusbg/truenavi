import AdminComponent from '@/app/admin/component';
import Container from '@/components/layout/Container';

const adminIcons = [
  { name: 'MdMap', href: 'map' },
  { name: 'MdExitToApp', href: 'login' },
];

export default function Admin() {
  return <Container icons={adminIcons} goBack={true} component={<AdminComponent />} />;
}
