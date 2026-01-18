'use client';

/**
 * Skeleton Component
 * 
 * Variants: text, circular, rectangular
 * Features: Shimmer animation, customizable dimensions
 */

export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  className = '',
  ...props
}) {
  const baseClasses = `
    bg-[var(--color-gray-200)]
    animate-shimmer
    rounded-[var(--radius-md)]
  `;

  // Text variant - multiple lines support
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`
              ${baseClasses}
              h-4
              ${index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
            `}
            style={{ width: index === lines - 1 ? undefined : width }}
          />
        ))}
      </div>
    );
  }

  // Circular variant
  if (variant === 'circular') {
    const size = width || height || '40px';
    return (
      <div
        className={`${baseClasses} rounded-full ${className}`}
        style={{
          width: size,
          height: size,
        }}
        {...props}
      />
    );
  }

  // Rectangular variant (default)
  return (
    <div
      className={`${baseClasses} ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
      {...props}
    />
  );
}

// Skeleton Card - preset for card loading
function SkeletonCard({ showImage = true, lines = 3, className = '' }) {
  return (
    <div className={`p-4 space-y-4 bg-white rounded-[var(--radius-xl)] border border-[var(--color-gray-200)] ${className}`}>
      {showImage && (
        <Skeleton variant="rectangular" height="160px" className="rounded-[var(--radius-lg)] -mx-4 -mt-4 mb-4" />
      )}
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={lines} />
    </div>
  );
}

// Skeleton Avatar - preset for avatar loading
function SkeletonAvatar({ size = 'md' }) {
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '56px',
    xl: '80px',
  };

  return <Skeleton variant="circular" width={sizes[size]} />;
}

// Skeleton Table Row - preset for table loading
function SkeletonTableRow({ columns = 4 }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-[var(--color-gray-100)]">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === 0 ? '30%' : '20%'}
        />
      ))}
    </div>
  );
}

// Attach presets
Skeleton.Card = SkeletonCard;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.TableRow = SkeletonTableRow;
