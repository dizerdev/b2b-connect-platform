'use client';

/**
 * VisuallyHidden - Screen reader only content
 *
 * Hides content visually but keeps it accessible to screen readers
 */

export default function VisuallyHidden({
  as: Component = 'span',
  children,
  ...props
}) {
  return (
    <Component className='sr-only' {...props}>
      {children}
    </Component>
  );
}
