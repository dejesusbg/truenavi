'use client';
import { Card } from '@/components/layout/Card';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';
import { ReactNode, useEffect } from 'react';
import { MdClose } from 'react-icons/md';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = { small: 'max-w-sm', medium: 'max-w-md', large: 'max-w-lg' };

export function Modal({ isOpen, onClose, title, children, size = 'medium' }: ModalProps) {
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
    <div className="fixed inset-0 z-[9999] items-center justify-center p-6 bg-overlay">
      <div className={clsx('rounded-xl w-full', sizeClasses[size])}>
        <Card
          className="!bg-overlay backdrop-blur-sm"
          title={title}
          headerRight={
            <Button
              onClick={onClose}
              variant="transparent"
              className="!p-0"
              icon={<MdClose className="text-2xl" />}
            />
          }>
          {children}
        </Card>
      </div>
    </div>
  );
}
