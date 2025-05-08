'use client';
import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = { small: 'max-w-sm', medium: 'max-w-md', large: 'max-w-lg' };

export function Modal({ isOpen, onClose, title, children, footer, size = 'medium' }: ModalProps) {
  // close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] items-center justify-center p-4 backdrop-blur-sm bg-overlay/50">
      <div className={clsx('bg-overlay rounded-xl w-full', sizeClasses[size])}>
        <div className="flex-row items-center justify-between p-6 border-b border-outline">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-white">
            <MdClose className="text-2xl" />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-6 border-t border-outline">{footer}</div>}
      </div>
    </div>
  );
}
