'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface MapToolButtonProps {
  icon: ReactNode;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isDanger?: boolean;
}

export function ToolButton({
  icon,
  label,
  isSelected,
  onClick,
  isDanger = false,
}: MapToolButtonProps) {
  return (
    <button
      className={clsx('flex-row justify-center items-center gap-2 flex-1 p-3 rounded-lg', {
        'bg-btn-danger outline-1 outline-danger': isSelected && isDanger,
        'bg-btn-tertiary outline-1 outline-btn-secondary': isSelected && !isDanger,
        'bg-btn-danger': !isSelected && isDanger,
        'bg-btn': !isSelected && !isDanger,
      })}
      onClick={onClick}>
      <span className="text-lg text-white">{icon}</span>
      <span className="text-white">{label}</span>
    </button>
  );
}
