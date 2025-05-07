'use client';
import { Container } from '@/components';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/app/map/component'), { ssr: false });

export default function Map() {
  const icon = { name: 'MdAdminPanelSettings', href: 'admin' };
  return <Container icon={icon} goBack={true} component={<MapComponent />} />;
}
