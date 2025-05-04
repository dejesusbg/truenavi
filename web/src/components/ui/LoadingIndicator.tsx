'use client';
import clsx from 'clsx';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = { small: 'w-4 h-4', medium: 'w-6 h-6', large: 'w-10 h-10' };

export function LoadingIndicator({ size = 'medium', className }: LoadingIndicatorProps) {
  return (
    <div className={clsx('flex justify-center items-center', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-t-transparent border-r-transparent border-foreground-muted',
          sizeClasses[size]
        )}
      />
    </div>
  );
}
