'use client';
import clsx from 'clsx';
import { MdClose, MdSearch } from 'react-icons/md';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'search',
  className,
}: SearchInputProps) {
  return (
    <div className={clsx('flex-row items-center bg-input rounded-lg px-3 gap-3 h-12', className)}>
      <MdSearch className="text-2xl text-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-white placeholder-white bg-transparent outline-none"
      />
      {value && (
        <button onClick={() => onChange('')}>
          <MdClose className="text-2xl text-icon" />
        </button>
      )}
    </div>
  );
}
