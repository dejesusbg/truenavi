'use client';
import { logoutUser } from '@/services/auth';
import { usePathname, useRouter } from 'next/navigation';
import { MdArrowBackIosNew } from 'react-icons/md';

export interface HeaderProps {
  icon?: { name: string; href: string };
  goBack?: boolean;
}

function Icon({ name }: { name: string }) {
  const IconComponent = require('react-icons/md')[name];
  return <IconComponent className="text-2xl text-white" />;
}

export function Header({ icon, goBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname().replace('/', '');

  return (
    <div className="flex-row justify-between items-center px-2.5 py-5 mb-4 w-full">
      <div className="flex-row items-center gap-4">
        {goBack && (
          <a
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-opacity-10 bg-btn-header"
            onClick={() => router.back()}>
            <MdArrowBackIosNew className="text-2xl text-white" />
          </a>
        )}
        <span className="text-xl font-semibold text-white">{pathname || 'truenavi'}</span>
      </div>

      <div className="flex-row items-center gap-4">
        {icon && (
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-opacity-10 bg-btn-header"
            onClick={() => router.push(icon.href)}>
            <Icon name={icon.name} />
          </button>
        )}
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-opacity-10 bg-btn-header"
          onClick={() => logoutUser(router)}>
          <Icon name="MdExitToApp" />
        </button>
      </div>
    </div>
  );
}
