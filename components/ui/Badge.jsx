'use client';

/**
 * Badge Component
 * 
 * Variants: default, success, warning, error, info, primary
 * Sizes: sm, md
 * Features: Dot indicator, removable
 */

const variants = {
  default: `
    bg-[var(--color-gray-100)]
    text-[var(--color-gray-700)]
    ring-[var(--color-gray-200)]
  `,
  primary: `
    bg-[var(--color-primary-100)]
    text-[var(--color-primary-800)]
    ring-[var(--color-primary-200)]
  `,
  success: `
    bg-[var(--color-success-bg)]
    text-[var(--color-accent-emerald)]
    ring-emerald-200
  `,
  warning: `
    bg-[var(--color-warning-bg)]
    text-[var(--color-accent-amber)]
    ring-amber-200
  `,
  error: `
    bg-[var(--color-error-bg)]
    text-[var(--color-accent-rose)]
    ring-rose-200
  `,
  info: `
    bg-[var(--color-info-bg)]
    text-[var(--color-accent-blue)]
    ring-blue-200
  `,
};

const dotColors = {
  default: 'bg-[var(--color-gray-400)]',
  primary: 'bg-[var(--color-primary-500)]',
  success: 'bg-[var(--color-accent-emerald)]',
  warning: 'bg-[var(--color-accent-amber)]',
  error: 'bg-[var(--color-accent-rose)]',
  info: 'bg-[var(--color-accent-blue)]',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = '',
  ...props
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium
        rounded-[var(--radius-full)]
        ring-1 ring-inset
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full
            ${dotColors[variant]}
          `}
        />
      )}

      {children}

      {/* Remove button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="
            -mr-1 ml-0.5
            w-4 h-4
            flex items-center justify-center
            rounded-full
            hover:bg-black/10
            transition-colors
          "
        >
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
