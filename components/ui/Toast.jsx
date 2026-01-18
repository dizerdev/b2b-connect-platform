'use client';

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Toast Component (Static - for custom toast renderer)
 * 
 * Variants: success, error, warning, info
 * Features: Icon, close button, animated
 */

const variants = {
  success: {
    container: 'bg-white border-l-4 border-l-[var(--color-accent-emerald)]',
    icon: CheckCircle2,
    iconColor: 'text-[var(--color-accent-emerald)]',
  },
  error: {
    container: 'bg-white border-l-4 border-l-[var(--color-accent-rose)]',
    icon: AlertCircle,
    iconColor: 'text-[var(--color-accent-rose)]',
  },
  warning: {
    container: 'bg-white border-l-4 border-l-[var(--color-accent-amber)]',
    icon: AlertTriangle,
    iconColor: 'text-[var(--color-accent-amber)]',
  },
  info: {
    container: 'bg-white border-l-4 border-l-[var(--color-accent-blue)]',
    icon: Info,
    iconColor: 'text-[var(--color-accent-blue)]',
  },
};

export default function Toast({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
  ...props
}) {
  const { container, icon: Icon, iconColor } = variants[variant];

  return (
    <div
      className={`
        flex items-start gap-3
        p-4
        rounded-[var(--radius-lg)]
        shadow-[var(--shadow-lg)]
        animate-slide-in-right
        ${container}
        ${className}
      `}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-[var(--color-gray-900)]">
            {title}
          </p>
        )}
        {message && (
          <p className="text-sm text-[var(--color-gray-600)] mt-0.5">
            {message}
          </p>
        )}
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="
            flex-shrink-0
            p-1
            rounded-[var(--radius-md)]
            text-[var(--color-gray-400)]
            hover:text-[var(--color-gray-600)]
            hover:bg-[var(--color-gray-100)]
            transition-colors
          "
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Wrapper for toast container position
function ToastContainer({ children, position = 'top-right', className = '' }) {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`
        fixed z-[var(--z-toast)]
        flex flex-col gap-2
        w-full max-w-sm
        ${positions[position]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

Toast.Container = ToastContainer;
