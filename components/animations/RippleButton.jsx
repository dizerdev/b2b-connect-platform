'use client';

import { useRef, useCallback } from 'react';

/**
 * RippleButton Component - Material Design ripple effect
 * 
 * Features:
 * - Click ripple animation
 * - Works with any background
 * - Customizable color
 */

export default function RippleButton({
  children,
  onClick,
  rippleColor = 'rgba(255, 255, 255, 0.4)',
  className = '',
  disabled = false,
  ...props
}) {
  const buttonRef = useRef(null);

  const createRipple = useCallback((event) => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: ${rippleColor};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    onClick?.(event);
  }, [onClick, rippleColor, disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={createRipple}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
