"use client"

import React, {createContext, useContext, useState, ReactNode} from 'react'
import Modal from './modal'

type OpenModalOptions = {
  Component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
}

type ModalContextValue = {
  openModal: (opts: OpenModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [component, setComponent] = useState<React.ComponentType<any> | undefined>(undefined)
  const [componentProps, setComponentProps] = useState<Record<string, any> | undefined>(undefined)

  function openModal({ Component, componentProps }: OpenModalOptions) {
    setComponent(() => Component)
    setComponentProps(componentProps)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    setComponent(undefined)
    setComponentProps(undefined)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} Component={component} componentProps={componentProps}></Modal>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
