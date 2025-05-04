'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface InputFieldProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  className?: string;
}

export function InputField({
  type,
  value,
  onChange,
  placeholder,
  label,
  icon,
  rightIcon,
  onRightIconClick,
  className,
}: InputFieldProps) {
  return (
    <div className="gap-1.5">
      {label && <label className="text-sm text-white">{label}</label>}
      <div className={clsx('flex-row items-center bg-input rounded-lg p-3', className)}>
        {icon && <span className="mr-3 text-xl text-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 text-white bg-transparent outline-none placeholder-foreground-subtle"
        />
        {rightIcon && (
          <button onClick={onRightIconClick} className="ml-3 text-xl text-icon">
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}
