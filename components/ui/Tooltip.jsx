'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip Component - Hover tooltip with multiple positions
 * 
 * Features:
 * - 4 positions (top, bottom, left, right)
 * - Animated entrance
 * - Auto-positioning to stay in viewport
 */

export default function Tooltip({
  children,
  content,
  position = 'top', // top, bottom, left, right
  delay = 200,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        updatePosition();
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipHeight = 32;
    const tooltipWidth = 150;
    const offset = 8;

    let top, left;
    let finalPosition = position;

    // Check if there's enough space
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    // Auto-adjust position if needed
    if (position === 'top' && spaceAbove < tooltipHeight + offset) {
      finalPosition = 'bottom';
    } else if (position === 'bottom' && spaceBelow < tooltipHeight + offset) {
      finalPosition = 'top';
    } else if (position === 'left' && spaceLeft < tooltipWidth + offset) {
      finalPosition = 'right';
    } else if (position === 'right' && spaceRight < tooltipWidth + offset) {
      finalPosition = 'left';
    }

    switch (finalPosition) {
      case 'top':
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - offset;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + offset;
        break;
      default:
        top = rect.top - offset;
        left = rect.left + rect.width / 2;
    }

    setCoords({ top, left });
    setActualPosition(finalPosition);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTransformStyle = () => {
    switch (actualPosition) {
      case 'top':
        return 'translate(-50%, -100%)';
      case 'bottom':
        return 'translate(-50%, 0)';
      case 'left':
        return 'translate(-100%, -50%)';
      case 'right':
        return 'translate(0, -50%)';
      default:
        return 'translate(-50%, -100%)';
    }
  };

  const getArrowStyle = () => {
    const base = 'absolute w-2 h-2 bg-[var(--color-gray-900)] rotate-45';
    switch (actualPosition) {
      case 'top':
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
      case 'bottom':
        return `${base} -top-1 left-1/2 -translate-x-1/2`;
      case 'left':
        return `${base} -right-1 top-1/2 -translate-y-1/2`;
      case 'right':
        return `${base} -left-1 top-1/2 -translate-y-1/2`;
      default:
        return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className={`inline-block ${className}`}
      >
        {children}
      </span>

      {isVisible && typeof window !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="
              fixed z-[9999]
              px-3 py-1.5
              text-sm text-white
              bg-[var(--color-gray-900)]
              rounded-[var(--radius-md)]
              shadow-[var(--shadow-lg)]
              whitespace-nowrap
              animate-fade-in
              pointer-events-none
            "
            style={{
              top: coords.top,
              left: coords.left,
              transform: getTransformStyle(),
            }}
          >
            <span className={getArrowStyle()} />
            {content}
          </div>,
          document.body
        )
      }
    </>
  );
}
