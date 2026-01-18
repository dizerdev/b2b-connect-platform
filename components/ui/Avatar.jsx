'use client';

/**
 * Avatar Component
 * 
 * Features: Image or Initials fallback, sizes, status indicator
 */

const sizes = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-xs',
    status: 'w-1.5 h-1.5 border',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-sm',
    status: 'w-2 h-2 border',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-base',
    status: 'w-2.5 h-2.5 border-2',
  },
  lg: {
    container: 'w-14 h-14',
    text: 'text-lg',
    status: 'w-3 h-3 border-2',
  },
  xl: {
    container: 'w-20 h-20',
    text: 'text-2xl',
    status: 'w-4 h-4 border-2',
  },
};

const statusColors = {
  online: 'bg-[var(--color-accent-emerald)]',
  offline: 'bg-[var(--color-gray-400)]',
  busy: 'bg-[var(--color-accent-rose)]',
  away: 'bg-[var(--color-accent-amber)]',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function stringToColor(str) {
  if (!str) return 'var(--color-primary-500)';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'var(--color-primary-500)',
    'var(--color-accent-blue)',
    'var(--color-accent-emerald)',
    'var(--color-accent-amber)',
    'var(--color-accent-rose)',
    'var(--color-primary-700)',
  ];
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  className = '',
  ...props
}) {
  const initials = getInitials(name || alt);
  const bgColor = stringToColor(name || alt);

  return (
    <div
      className={`
        relative inline-flex items-center justify-center
        rounded-full
        overflow-hidden
        flex-shrink-0
        ${sizes[size].container}
        ${className}
      `}
      {...props}
    >
      {/* Image or Fallback */}
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      {/* Initials fallback (shown when no image or image fails) */}
      <div
        className={`
          w-full h-full
          flex items-center justify-center
          font-semibold text-white
          ${sizes[size].text}
          ${src ? 'hidden' : 'flex'}
        `}
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>

      {/* Status indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            rounded-full
            border-white
            ${sizes[size].status}
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
}

// Avatar Group for stacked avatars
function AvatarGroup({ children, max = 4, size = 'md', className = '' }) {
  const avatars = Array.isArray(children) ? children : [children];
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {visible.map((avatar, index) => (
        <div
          key={index}
          className="ring-2 ring-white rounded-full"
          style={{ zIndex: visible.length - index }}
        >
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={`
            flex items-center justify-center
            rounded-full
            bg-[var(--color-gray-200)]
            text-[var(--color-gray-600)]
            font-medium
            ring-2 ring-white
            ${sizes[size].container}
            ${sizes[size].text}
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

Avatar.Group = AvatarGroup;
