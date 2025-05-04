'use client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { MdClose, MdDone, MdError, MdInfo, MdWarning } from 'react-icons/md';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const typeMap = {
  success: { icon: <MdDone />, bgColor: 'bg-green-600/20' },
  error: { icon: <MdError />, bgColor: 'bg-danger-light' },
  info: { icon: <MdInfo />, bgColor: 'bg-secondary/20' },
  warning: { icon: <MdWarning />, bgColor: 'bg-yellow-600/20' },
};

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const { icon, bgColor } = typeMap[type];

  return (
    <div
      className={clsx(
        'fixed bottom-3 left-1/2 transform -translate-x-1/2 text-white py-1.5 px-4 rounded-lg shadow-lg flex-row gap-3 items-center max-w-sm transition-opacity duration-300',
        visible ? 'opacity-100' : 'opacity-0',
        bgColor
      )}>
      <div className="text-lg text-white">{icon}</div>
      <p className="flex-1">{message}</p>
      <button onClick={onClose}>
        <MdClose className="text-lg" />
      </button>
    </div>
  );
}
