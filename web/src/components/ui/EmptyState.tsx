'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
  className?: string;
}

export default function EmptyState({ icon, message, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex-1 justify-center items-center py-8', className)}>
      <div className="mb-4 text-5xl text-icon">{icon}</div>
      <p className="text-foreground-subtle">{message}</p>
    </div>
  );
}
