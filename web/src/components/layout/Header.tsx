'use client';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface HeaderProps {
  title?: string;
  goBack?: boolean;
  icons?: { name: string; href?: string }[];
}

const Header = ({ title, icons, goBack = false }: HeaderProps) => {
  const router = useRouter();

  const Icon = ({ name }: { name: string }) => {
    const IconEl = require(`react-icons/fa`)[name] || require(`react-icons/fi`)[name];
    return <IconEl className="text-white text-lg" />;
  };

  return (
    <div className="flex-row justify-between items-center px-2.5 py-5 w-full">
      <div className="flex-row items-center gap-4">
        {goBack && (
          <a
            className="w-8 h-8 bg-opacity-10 bg-btn-header rounded-lg flex items-center justify-center"
            onClick={() => router.back()}>
            <FaArrowLeft className="text-white text-lg" />
          </a>
        )}
        <span className="text-white text-xl font-semibold">{title}</span>
      </div>

      <div className="flex-row items-center gap-4">
        {icons &&
          icons.length > 0 &&
          icons.map(({ name, href }, index) => (
            <button
              key={index}
              className="w-8 h-8 bg-opacity-10 bg-btn-header rounded-lg flex items-center justify-center"
              onClick={() => {
                router.push(href || '/');
              }}>
              <Icon name={name} />
            </button>
          ))}
      </div>
    </div>
  );
};

export default Header;
