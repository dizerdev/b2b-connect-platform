'use client';

import Spinner from './Spinner';

/**
 * PageLoader Component - Full page loading overlay
 * 
 * Features:
 * - Full screen overlay
 * - Logo animation
 * - Optional message
 * - Backdrop blur
 */

export default function PageLoader({
  message = 'Carregando...',
  showLogo = true,
  transparent = false,
  className = '',
}) {
  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center gap-6
        ${transparent 
          ? 'bg-white/80 backdrop-blur-sm' 
          : 'bg-white'
        }
        ${className}
      `}
    >
      {showLogo ? (
        <div className="relative">
          {/* Logo container with pulse effect */}
          <div className="
            w-20 h-20
            flex items-center justify-center
            rounded-2xl
            bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]
            shadow-[var(--shadow-lg)]
            animate-pulse-soft
          ">
            <span className="text-3xl font-bold text-white font-heading">
              SN
            </span>
          </div>
          
          {/* Orbiting ring */}
          <div className="
            absolute -inset-4
            rounded-3xl
            border-2 border-[var(--color-primary-200)]
            animate-spin
          " style={{ animationDuration: '3s' }} />
        </div>
      ) : (
        <Spinner size="xl" variant="ring" />
      )}

      {/* Message */}
      <div className="text-center">
        <p className="text-[var(--color-gray-600)] font-medium animate-pulse">
          {message}
        </p>
        <div className="mt-2 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-400)]"
              style={{
                animation: 'bounce 1.4s infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-6px);
          }
        }
      `}</style>
    </div>
  );
}
