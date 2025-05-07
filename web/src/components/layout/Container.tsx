'use client';
import { Header, HeaderProps } from '@/components/layout/Header';

interface ContainerProps extends HeaderProps {
  component: React.ReactNode;
}

export function Container({ icon, goBack = false, component }: ContainerProps) {
  return (
    <>
      {icon && <Header icon={icon} goBack={goBack} />}
      {component}
    </>
  );
}
