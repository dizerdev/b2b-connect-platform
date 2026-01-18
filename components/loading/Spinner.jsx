'use client';

/**
 * Spinner Component - Multiple loading spinner styles
 * 
 * Features:
 * - 4 variants (default, dots, bars, ring)
 * - Multiple sizes
 * - Customizable colors
 */

export default function Spinner({
  variant = 'default', // default, dots, bars, ring
  size = 'md', // sm, md, lg, xl
  color = 'primary', // primary, white, gray
  className = '',
}) {
  const sizes = {
    sm: { spinner: 16, stroke: 2 },
    md: { spinner: 24, stroke: 2.5 },
    lg: { spinner: 36, stroke: 3 },
    xl: { spinner: 48, stroke: 3.5 },
  };

  const colors = {
    primary: 'text-[var(--color-primary-500)]',
    white: 'text-white',
    gray: 'text-[var(--color-gray-400)]',
  };

  const sizeConfig = sizes[size];
  const colorClass = colors[color];

  // Default spinning circle
  if (variant === 'default') {
    return (
      <svg
        className={`animate-spin ${colorClass} ${className}`}
        width={sizeConfig.spinner}
        height={sizeConfig.spinner}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth={sizeConfig.stroke}
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );
  }

  // Bouncing dots
  if (variant === 'dots') {
    const dotSize = sizeConfig.spinner / 4;
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full ${colorClass.replace('text-', 'bg-')}`}
            style={{
              width: dotSize,
              height: dotSize,
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Animated bars
  if (variant === 'bars') {
    const barWidth = sizeConfig.spinner / 6;
    const barHeight = sizeConfig.spinner;
    return (
      <div className={`flex items-end gap-0.5 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={colorClass.replace('text-', 'bg-')}
            style={{
              width: barWidth,
              height: barHeight,
              animation: `bars 1.2s infinite ease-in-out`,
              animationDelay: `${i * 0.1}s`,
              borderRadius: 2,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes bars {
            0%, 40%, 100% {
              transform: scaleY(0.4);
            }
            20% {
              transform: scaleY(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Ring spinner
  if (variant === 'ring') {
    return (
      <div
        className={`relative ${className}`}
        style={{ width: sizeConfig.spinner, height: sizeConfig.spinner }}
      >
        <div
          className={`absolute inset-0 rounded-full border-2 border-current opacity-20 ${colorClass}`}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin ${colorClass}`}
        />
      </div>
    );
  }

  return null;
}
