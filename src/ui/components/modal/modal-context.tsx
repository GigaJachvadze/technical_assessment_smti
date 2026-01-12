"use client"

import React, {createContext, useContext, useState, ReactNode} from 'react'
import Modal from './modal'

type OpenModalOptions = {
  Component?: React.ComponentType<any>;
  componentProps?: Record<string, any>;
  children?: React.ReactNode;
  ariaLabel?: string;
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
  const [childrenContent, setChildrenContent] = useState<ReactNode | undefined>(undefined)
  const [ariaLabel, setAriaLabel] = useState<string | undefined>(undefined)

  function openModal({ Component, componentProps, children, ariaLabel }: OpenModalOptions) {
    setComponent(() => Component)
    setComponentProps(componentProps)
    setChildrenContent(children)
    setAriaLabel(ariaLabel)
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
    // clear content after a short delay to allow exit animations if desired
    setTimeout(() => {
      setComponent(undefined)
      setComponentProps(undefined)
      setChildrenContent(undefined)
      setAriaLabel(undefined)
    }, 300)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal} Component={component} componentProps={componentProps} ariaLabel={ariaLabel}>
        {childrenContent}
      </Modal>
    </ModalContext.Provider>
  )
}

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within ModalProvider')
  return ctx
}
