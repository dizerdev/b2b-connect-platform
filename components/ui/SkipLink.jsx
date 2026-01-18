'use client';

/**
 * SkipLink - Accessibility skip link for keyboard navigation
 *
 * Allows keyboard users to skip to main content
 * Should be the first focusable element on the page
 */

export default function SkipLink({
  href = '#main-content',
  children = 'Pular para o conteúdo principal',
}) {
  return (
    <a href={href} className='skip-link focus:outline-none'>
      {children}
    </a>
  );
}
