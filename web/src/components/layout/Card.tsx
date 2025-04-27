'use client';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export default function Card({ children, title, className, headerRight }: CardProps) {
  return (
    <div className={clsx('bg-container p-6 rounded-xl', className)}>
      {(title || headerRight) && (
        <div className="flex-row items-center justify-between mb-4">
          {title &&
            (typeof title === 'string' ? (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            ) : (
              title
            ))}
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}
