'use client';

import Spinner from './Spinner';

/**
 * ContentLoader Component - Inline content loading placeholder
 * 
 * Features:
 * - Minimal design
 * - Custom height
 * - Optional spinner
 * - Message support
 */

export default function ContentLoader({
  height = 200,
  message = '',
  showSpinner = true,
  className = '',
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        bg-[var(--color-gray-50)]
        rounded-[var(--radius-xl)]
        border border-[var(--color-gray-100)]
        ${className}
      `}
      style={{ minHeight: height }}
    >
      {showSpinner && (
        <Spinner size="lg" variant="dots" />
      )}
      {message && (
        <p className="mt-4 text-sm text-[var(--color-gray-500)]">
          {message}
        </p>
      )}
    </div>
  );
}
