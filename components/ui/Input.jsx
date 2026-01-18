'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Input Component
 * 
 * Variants: default, error, success
 * Features: Label, helper text, icons, password toggle
 */

const variants = {
  default: `
    border-[var(--color-gray-300)]
    focus:border-[var(--color-accent-blue)]
    focus:ring-[var(--color-accent-blue)]
  `,
  error: `
    border-[var(--color-accent-rose)]
    focus:border-[var(--color-accent-rose)]
    focus:ring-[var(--color-accent-rose)]
    bg-[var(--color-error-bg)]
  `,
  success: `
    border-[var(--color-accent-emerald)]
    focus:border-[var(--color-accent-emerald)]
    focus:ring-[var(--color-accent-emerald)]
    bg-[var(--color-success-bg)]
  `,
};

const Input = forwardRef(function Input(
  {
    label,
    helperText,
    error,
    success,
    type = 'text',
    icon: Icon,
    iconPosition = 'left',
    fullWidth = true,
    className = '',
    containerClassName = '',
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // Determine variant
  let variant = 'default';
  if (error) variant = 'error';
  else if (success) variant = 'success';

  // Determine helper content
  const helperContent = error || success || helperText;

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[var(--color-gray-700)] mb-1.5">
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
            <Icon size={18} />
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full
            px-4 py-2.5
            text-base text-[var(--color-gray-900)]
            placeholder:text-[var(--color-gray-400)]
            border rounded-[var(--radius-lg)]
            transition-all duration-[var(--transition-fast)]
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-[var(--color-gray-100)] disabled:cursor-not-allowed
            ${variants[variant]}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Right icon */}
        {Icon && iconPosition === 'right' && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
            <Icon size={18} />
          </div>
        )}

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {/* Status icons */}
        {error && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-rose)]">
            <AlertCircle size={18} />
          </div>
        )}
        {success && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-accent-emerald)]">
            <CheckCircle2 size={18} />
          </div>
        )}
      </div>

      {/* Helper text / Error / Success message */}
      {helperContent && (
        <p
          className={`
            mt-1.5 text-sm
            ${error ? 'text-[var(--color-accent-rose)]' : ''}
            ${success ? 'text-[var(--color-accent-emerald)]' : ''}
            ${!error && !success ? 'text-[var(--color-gray-500)]' : ''}
          `}
        >
          {helperContent}
        </p>
      )}
    </div>
  );
});

export default Input;
