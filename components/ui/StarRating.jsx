'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * 
 * Interactive star rating with hover preview and animations
 */

export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  readonly = false,
  showValue = false,
  className = '',
}) {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    sm: { star: 16, gap: 'gap-0.5' },
    md: { star: 20, gap: 'gap-1' },
    lg: { star: 28, gap: 'gap-1.5' },
    xl: { star: 36, gap: 'gap-2' },
  };

  const sizeConfig = sizes[size] || sizes.md;
  const displayValue = hoverValue || value;

  const handleClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        const isHalf = !isFilled && star - 0.5 <= displayValue;

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              transition-all duration-200
              ${readonly 
                ? 'cursor-default' 
                : 'cursor-pointer hover:scale-110 active:scale-95'
              }
              ${isFilled || isHalf 
                ? 'text-[var(--color-accent-amber)]' 
                : 'text-[var(--color-gray-300)]'
              }
            `}
          >
            <Star
              size={sizeConfig.star}
              fill={isFilled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-[var(--color-gray-600)]">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
