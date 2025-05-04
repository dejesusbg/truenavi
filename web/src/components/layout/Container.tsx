'use client';
import { Header, HeaderProps } from '@/components/layout/Header';

interface ContainerProps extends HeaderProps {
  component: React.ReactNode;
}

export function Container({ icons, goBack = false, component }: ContainerProps) {
  return (
    <>
      {icons && <Header icons={icons} goBack={goBack} />}
      {component}
    </>
  );
}
