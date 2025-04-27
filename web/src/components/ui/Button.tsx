'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'disabled' | 'transparent';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const variantClasses = {
  primary: 'bg-btn',
  secondary: 'bg-btn-secondary',
  tertiary: 'bg-btn-tertiary',
  danger: 'bg-btn-danger',
  disabled: 'bg-btn-disabled',
  transparent: 'bg-transparent',
};

export default function Button({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  className,
  fullWidth = false,
  disabled = false,
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-lg p-3 text-white transition',
        { 'w-full': fullWidth, 'cursor-not-allowed hover:brightness-100': disabled },
        variantClasses[disabled ? 'disabled' : variant],
        className
      )}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
