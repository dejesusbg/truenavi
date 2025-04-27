'use client';
import Container from '@/components/layout/Container';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/map/component'), { ssr: false });

const mapIcons = [
  { name: 'MdAdminPanelSettings', href: 'admin' },
  { name: 'MdExitToApp', href: 'login' },
];

export default function Map() {
  return <Container icons={mapIcons} goBack={true} component={<MapComponent />} />;
}
