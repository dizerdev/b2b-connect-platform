'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * FadeIn Component - Animate elements on mount
 * 
 * Features:
 * - Multiple animation types
 * - Customizable delay and duration
 * - Intersection Observer for scroll-triggered animations
 */

export default function FadeIn({
  children,
  animation = 'fade-in-up', // fade-in, fade-in-up, fade-in-down, scale-in, slide-in-left, slide-in-right, bounce-in, zoom-in
  delay = 0, // in milliseconds
  duration = 400, // in milliseconds
  triggerOnScroll = false,
  threshold = 0.1,
  className = '',
  as: Component = 'div',
}) {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const ref = useRef(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [triggerOnScroll, delay, threshold]);

  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'none' : getInitialTransform(animation),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    transitionDelay: triggerOnScroll ? '0ms' : `${delay}ms`,
  };

  return (
    <Component
      ref={ref}
      className={className}
      style={animationStyles}
    >
      {children}
    </Component>
  );
}

function getInitialTransform(animation) {
  switch (animation) {
    case 'fade-in-up':
      return 'translateY(20px)';
    case 'fade-in-down':
      return 'translateY(-20px)';
    case 'scale-in':
      return 'scale(0.95)';
    case 'slide-in-left':
      return 'translateX(-20px)';
    case 'slide-in-right':
      return 'translateX(20px)';
    case 'bounce-in':
      return 'scale(0.3)';
    case 'zoom-in':
      return 'scale(0.5)';
    default:
      return 'none';
  }
}
