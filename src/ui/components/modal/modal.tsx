"use client"

import React, {useEffect} from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  Component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
  children?: React.ReactNode;
  ariaLabel?: string;
};

export default function Modal({ isOpen, onClose, Component, componentProps, children, ariaLabel = 'Modal' }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return typeof document !== 'undefined' ? createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        data-testid="modal-backdrop"
      />
      <div
        role="dialog"
        aria-label={ariaLabel}
        aria-modal="true"
        className="relative z-10 bg-[#1A242E] rounded-2xl shadow p-4 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {Component ? <Component {...componentProps} /> : children}
      </div>
    </div>,
    document.body
  ) : null;
}
