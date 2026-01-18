'use client';

import { useEffect, useState } from 'react';

/**
 * ProgressBar Component - Animated progress indicator
 * 
 * Features:
 * - Smooth animation
 * - Multiple colors
 * - Optional label
 * - Indeterminate mode
 */

const colorVariants = {
  primary: 'bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-600)]',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  warning: 'bg-gradient-to-r from-amber-400 to-amber-600',
  error: 'bg-gradient-to-r from-rose-400 to-rose-600',
  info: 'bg-gradient-to-r from-blue-400 to-blue-600',
};

export default function ProgressBar({
  value = 0, // 0-100
  max = 100,
  color = 'primary',
  size = 'md', // sm, md, lg
  showLabel = false,
  indeterminate = false,
  animated = true,
  className = '',
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated && !indeterminate) {
      // Animate to target value
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated, indeterminate]);

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-sm font-medium text-[var(--color-gray-700)]">
            Progresso
          </span>
          <span className="text-sm font-medium text-[var(--color-gray-500)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        className={`
          w-full
          ${sizes[size]}
          bg-[var(--color-gray-200)]
          rounded-full
          overflow-hidden
        `}
      >
        <div
          className={`
            ${sizes[size]}
            ${colorVariants[color]}
            rounded-full
            transition-all duration-500 ease-out
            ${indeterminate ? 'animate-progress-indeterminate w-1/3' : ''}
          `}
          style={indeterminate ? {} : { width: `${percentage}%` }}
        />
      </div>

      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
