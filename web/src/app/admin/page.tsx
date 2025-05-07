import AdminComponent from '@/app/admin/component';
import { Container } from '@/components';

export default function Admin() {
  const icon = { name: 'MdMap', href: 'map' };
  return <Container icon={icon} goBack={true} component={<AdminComponent />} />;
}
