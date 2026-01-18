'use client';

import { useState, useEffect } from 'react';
import { Check, X, AlertCircle, Info, Loader2 } from 'lucide-react';

/**
 * StatusIndicator Component - Visual feedback states
 * 
 * Features:
 * - Multiple status types
 * - Animated icons
 * - Optional message
 * - Auto-dismiss
 */

const statusConfig = {
  success: {
    icon: Check,
    color: 'text-[var(--color-accent-emerald)]',
    bg: 'bg-[var(--color-success-bg)]',
    border: 'border-emerald-200',
  },
  error: {
    icon: X,
    color: 'text-[var(--color-accent-rose)]',
    bg: 'bg-[var(--color-error-bg)]',
    border: 'border-rose-200',
  },
  warning: {
    icon: AlertCircle,
    color: 'text-[var(--color-accent-amber)]',
    bg: 'bg-[var(--color-warning-bg)]',
    border: 'border-amber-200',
  },
  info: {
    icon: Info,
    color: 'text-[var(--color-accent-blue)]',
    bg: 'bg-[var(--color-info-bg)]',
    border: 'border-blue-200',
  },
  loading: {
    icon: Loader2,
    color: 'text-[var(--color-primary-500)]',
    bg: 'bg-[var(--color-gray-50)]',
    border: 'border-[var(--color-gray-200)]',
  },
};

export default function StatusIndicator({
  status = 'info', // success, error, warning, info, loading
  message,
  showIcon = true,
  inline = false,
  size = 'md', // sm, md, lg
  autoDismiss = false,
  dismissAfter = 3000,
  onDismiss,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true);
  const config = statusConfig[status];
  const IconComponent = config.icon;

  useEffect(() => {
    if (autoDismiss && status !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, status, onDismiss]);

  if (!isVisible) return null;

  const sizes = {
    sm: {
      icon: 14,
      padding: 'px-2 py-1',
      text: 'text-xs',
    },
    md: {
      icon: 18,
      padding: 'px-3 py-2',
      text: 'text-sm',
    },
    lg: {
      icon: 22,
      padding: 'px-4 py-3',
      text: 'text-base',
    },
  };

  const sizeConfig = sizes[size];

  if (inline) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${config.color} ${sizeConfig.text} ${className}`}>
        {showIcon && (
          <IconComponent
            size={sizeConfig.icon}
            className={status === 'loading' ? 'animate-spin' : 'animate-bounce-in'}
          />
        )}
        {message}
      </span>
    );
  }

  return (
    <div
      className={`
        flex items-center gap-3
        ${sizeConfig.padding}
        ${config.bg}
        border ${config.border}
        rounded-[var(--radius-lg)]
        animate-fade-in-up
        ${className}
      `}
    >
      {showIcon && (
        <div className={`flex-shrink-0 ${config.color}`}>
          <IconComponent
            size={sizeConfig.icon}
            className={status === 'loading' ? 'animate-spin' : ''}
          />
        </div>
      )}
      {message && (
        <span className={`${sizeConfig.text} text-[var(--color-gray-700)]`}>
          {message}
        </span>
      )}
    </div>
  );
}
