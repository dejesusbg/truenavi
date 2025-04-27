'use client';
import Header, { HeaderProps } from '@/components/layout/Header';

interface ContainerProps extends HeaderProps {
  component: React.ReactNode;
}

export default function Container({ icons, goBack = false, component }: ContainerProps) {
  return (
    <>
      <Header icons={icons} goBack={goBack} />
      {component}
    </>
  );
}
