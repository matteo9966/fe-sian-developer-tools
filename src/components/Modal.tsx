import React, { ReactNode, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPortalRoot } from '../utils/portalRoot';
import "./Modal.css"
export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when modal should close
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title?: string;
  /**
   * Modal content
   */
  children: ReactNode;
  /**
   * Optional className for styling
   */
  className?: string;
  /**
   * Optional overlay className
   */
  overlayClassName?: string;
  /**
   * Whether to close on escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to close on overlay click
   */
  closeOnOverlayClick?: boolean;
}

/**
 * Modal component for displaying content in a dialog
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  overlayClassName,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`modal-overlay ${overlayClassName || ''}`}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className={`modal-content ${className || ''}`} role="dialog" aria-modal="true">
        {title && <div className="modal-header">{title}</div>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, getPortalRoot());
};
