'use client';
import { ReactNode } from 'react';

interface MapStatCounterProps {
  icon: ReactNode;
  label: string;
  count: number;
}

export default function MapStatCounter({ icon, label, count }: MapStatCounterProps) {
  return (
    <div className="flex-row items-center gap-2">
      <span className="text-lg text-icon-muted">{icon}</span>
      <span className="text-foreground-muted">
        {count} {label}
      </span>
    </div>
  );
}
