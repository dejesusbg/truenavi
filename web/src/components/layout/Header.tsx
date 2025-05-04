'use client';
import { usePathname, useRouter } from 'next/navigation';
import { MdArrowBackIosNew } from 'react-icons/md';

export interface HeaderProps {
  goBack?: boolean;
  icons?: { name: string; href?: string }[];
}

function Icon({ name }: { name: string }) {
  const IconComponent = require('react-icons/md')[name];
  return <IconComponent className="text-2xl text-white" />;
}

export function Header({ icons, goBack = false }: HeaderProps) {
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
        {icons &&
          icons.length > 0 &&
          icons.map(({ name, href }, index) => (
            <button
              key={index}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-opacity-10 bg-btn-header"
              onClick={() => {
                router.push(href || '/');
              }}>
              <Icon name={name} />
            </button>
          ))}
      </div>
    </div>
  );
}
