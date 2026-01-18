'use client';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Component
 * 
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 * States: hover, active, disabled, loading
 */

const variants = {
  primary: `
    bg-[var(--color-primary-600)] text-white
    hover:bg-[var(--color-primary-700)]
    active:bg-[var(--color-primary-800)]
    focus-visible:ring-[var(--color-primary-500)]
  `,
  secondary: `
    bg-[var(--color-gray-100)] text-[var(--color-gray-900)]
    hover:bg-[var(--color-gray-200)]
    active:bg-[var(--color-gray-300)]
    focus-visible:ring-[var(--color-gray-400)]
  `,
  outline: `
    border-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)]
    bg-transparent
    hover:bg-[var(--color-primary-50)]
    active:bg-[var(--color-primary-100)]
    focus-visible:ring-[var(--color-primary-500)]
  `,
  ghost: `
    bg-transparent text-[var(--color-gray-700)]
    hover:bg-[var(--color-gray-100)]
    active:bg-[var(--color-gray-200)]
    focus-visible:ring-[var(--color-gray-400)]
  `,
  danger: `
    bg-[var(--color-accent-rose)] text-white
    hover:bg-[var(--color-accent-rose-hover)]
    active:brightness-90
    focus-visible:ring-[var(--color-accent-rose)]
  `,
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 20,
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    className = '',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-[var(--radius-lg)]
        transition-all duration-[var(--transition-fast)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <Loader2 
          size={iconSizes[size]} 
          className="animate-spin"
        />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon size={iconSizes[size]} />
      )}
      
      {children}
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={iconSizes[size]} />
      )}
    </button>
  );
});

export default Button;
