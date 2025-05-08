'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface MapToolButtonProps {
  icon: ReactNode;
  isSelected: boolean;
  onClick: () => void;
  isDanger?: boolean;
}

export function ToolButton({ icon, isSelected, onClick, isDanger = false }: MapToolButtonProps) {
  return (
    <button
      className={clsx('p-3 rounded-lg', {
        'bg-btn-danger outline-1 outline-danger': isSelected && isDanger,
        'bg-btn-tertiary outline-1 outline-btn-secondary': isSelected && !isDanger,
        'bg-btn-danger': !isSelected && isDanger,
        'bg-btn': !isSelected && !isDanger,
      })}
      onClick={onClick}>
      <span className="text-2xl text-white">{icon}</span>
    </button>
  );
}
