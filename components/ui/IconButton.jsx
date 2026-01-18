'use client';

import { forwardRef } from 'react';

/**
 * IconButton - Accessible button with icon only
 *
 * Features:
 * - Required aria-label for screen readers
 * - Focus visible styles
 * - Multiple variants and sizes
 */

const IconButton = forwardRef(function IconButton(
  {
    icon: Icon,
    'aria-label': ariaLabel,
    variant = 'ghost', // ghost, solid, outline
    size = 'md', // sm, md, lg
    disabled = false,
    loading = false,
    className = '',
    ...props
  },
  ref,
) {
  // Require aria-label for accessibility
  if (!ariaLabel && process.env.NODE_ENV === 'development') {
    console.warn('IconButton: aria-label is required for accessibility');
  }

  const variants = {
    ghost: `
      bg-transparent
      hover:bg-[var(--color-gray-100)]
      text-[var(--color-gray-600)]
      hover:text-[var(--color-gray-900)]
    `,
    solid: `
      bg-[var(--color-primary-500)]
      hover:bg-[var(--color-primary-600)]
      text-white
    `,
    outline: `
      bg-transparent
      border border-[var(--color-gray-300)]
      hover:border-[var(--color-gray-400)]
      hover:bg-[var(--color-gray-50)]
      text-[var(--color-gray-600)]
    `,
  };

  const sizes = {
    sm: { button: 'w-8 h-8', icon: 16 },
    md: { button: 'w-10 h-10', icon: 20 },
    lg: { button: 'w-12 h-12', icon: 24 },
  };

  const sizeConfig = sizes[size];

  return (
    <button
      ref={ref}
      type='button'
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      className={`
        inline-flex items-center justify-center
        ${sizeConfig.button}
        rounded-lg
        transition-all duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--color-primary-500)]
        focus-visible:ring-offset-2
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className='animate-spin'
          width={sizeConfig.icon}
          height={sizeConfig.icon}
          viewBox='0 0 24 24'
          fill='none'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='3'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
          />
        </svg>
      ) : (
        <Icon size={sizeConfig.icon} aria-hidden='true' />
      )}
    </button>
  );
});

export default IconButton;
