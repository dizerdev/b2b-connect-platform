'use client';

import { forwardRef } from 'react';

/**
 * Card Component
 * 
 * Variants: default, elevated, outlined
 * Features: Header, Body, Footer slots, hover effects, clickable
 */

const variants = {
  default: `
    bg-white
    border border-[var(--color-gray-200)]
    shadow-[var(--shadow-sm)]
  `,
  elevated: `
    bg-white
    shadow-[var(--shadow-md)]
    hover:shadow-[var(--shadow-lg)]
  `,
  outlined: `
    bg-white
    border-2 border-[var(--color-gray-200)]
    hover:border-[var(--color-primary-300)]
  `,
};

const Card = forwardRef(function Card(
  {
    children,
    variant = 'default',
    clickable = false,
    padding = true,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`
        rounded-[var(--radius-xl)]
        overflow-hidden
        transition-all duration-[var(--transition-normal)]
        ${variants[variant]}
        ${clickable ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}
        ${padding ? 'p-4' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
});

// Card Header
function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`
        pb-3 mb-3
        border-b border-[var(--color-gray-100)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Body
function CardBody({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

// Card Footer
function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`
        pt-3 mt-3
        border-t border-[var(--color-gray-100)]
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Image
function CardImage({ src, alt, aspectRatio = 'auto', className = '', ...props }) {
  const aspectClasses = {
    auto: '',
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className={`-m-4 mb-4 overflow-hidden ${aspectClasses[aspectRatio]}`}>
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-full object-cover
          transition-transform duration-[var(--transition-slow)]
          group-hover:scale-105
          ${className}
        `}
        {...props}
      />
    </div>
  );
}

// Attach subcomponents
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
