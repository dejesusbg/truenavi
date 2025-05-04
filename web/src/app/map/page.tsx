'use client';
import dynamic from 'next/dynamic';
import { Container } from '@/components';

const MapComponent = dynamic(() => import('@/app/map/component'), { ssr: false });

const mapIcons = [
  { name: 'MdAdminPanelSettings', href: 'admin' },
  { name: 'MdExitToApp', href: 'login' },
];

export default function Map() {
  return <Container icons={mapIcons} goBack={true} component={<MapComponent />} />;
}
