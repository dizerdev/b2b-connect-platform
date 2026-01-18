'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/**
 * AccessibleModal - Modal with full keyboard navigation and ARIA support
 *
 * Features:
 * - Focus trap: Tab stays within modal
 * - ESC key to close
 * - Auto-focus first focusable element
 * - Restore focus on close
 * - ARIA attributes
 * - Click outside to close
 */

export default function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md', // sm, md, lg, xl, full
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size variants
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  // Get all focusable elements within modal
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
  }, []);

  // Trap focus within modal
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose, getFocusableElements],
  );

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement;

      // Focus first focusable element after a small delay
      const timer = setTimeout(() => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';

        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown, getFocusableElements]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center p-4'
      role='presentation'
    >
      {/* Overlay */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in'
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden='true'
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={`
          relative
          w-full ${sizes[size]}
          bg-white
          rounded-[var(--radius-2xl)]
          shadow-2xl
          animate-scale-in
          overflow-hidden
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className='flex items-center justify-between p-5 border-b border-[var(--color-gray-100)]'>
            {title && (
              <h2
                id='modal-title'
                className='text-xl font-bold text-[var(--color-gray-900)]'
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className='
                  p-2 -m-2 ml-4
                  rounded-lg
                  text-[var(--color-gray-500)]
                  hover:text-[var(--color-gray-900)]
                  hover:bg-[var(--color-gray-100)]
                  transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]
                '
                aria-label='Fechar modal'
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Description for screen readers */}
        {description && (
          <p id='modal-description' className='sr-only'>
            {description}
          </p>
        )}

        {/* Content */}
        <div className='p-5 overflow-y-auto max-h-[70vh]'>{children}</div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

// Confirm Dialog - convenience wrapper
AccessibleModal.Confirm = function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger', // danger, warning, info
}) {
  const variants = {
    danger: 'bg-[var(--color-accent-rose)] hover:bg-red-600',
    warning: 'bg-[var(--color-accent-amber)] hover:bg-amber-600',
    info: 'bg-[var(--color-accent-blue)] hover:bg-blue-600',
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size='sm'
      closeOnOverlay={false}
    >
      <div className='text-center'>
        <p className='text-[var(--color-gray-600)] mb-6'>{message}</p>
        <div className='flex gap-3 justify-center'>
          <button
            onClick={onClose}
            className='
              px-4 py-2
              border border-[var(--color-gray-300)]
              rounded-lg
              text-[var(--color-gray-700)]
              hover:bg-[var(--color-gray-50)]
              transition-colors
              focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]
            '
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
            className={`
              px-4 py-2
              ${variants[variant]}
              text-white
              rounded-lg
              transition-colors
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-500)]
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </AccessibleModal>
  );
};
