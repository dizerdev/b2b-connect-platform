'use client';

import { useEffect, useState, useRef, Children, cloneElement } from 'react';

/**
 * StaggerChildren Component - Animate children with staggered delays
 * 
 * Features:
 * - Automatic stagger delay calculation
 * - Multiple animation types
 * - Scroll-triggered option
 */

export default function StaggerChildren({
  children,
  animation = 'fade-in-up',
  staggerDelay = 100, // delay between each child in ms
  initialDelay = 0, // initial delay before first child animates
  duration = 400,
  triggerOnScroll = false,
  threshold = 0.1,
  className = '',
  as: Component = 'div',
}) {
  const [isVisible, setIsVisible] = useState(!triggerOnScroll);
  const ref = useRef(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      const timer = setTimeout(() => setIsVisible(true), initialDelay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), initialDelay);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [triggerOnScroll, initialDelay, threshold]);

  const childrenArray = Children.toArray(children);

  return (
    <Component ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <StaggerChild
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          duration={duration}
          isVisible={isVisible}
        >
          {child}
        </StaggerChild>
      ))}
    </Component>
  );
}

function StaggerChild({ children, animation, delay, duration, isVisible }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldAnimate(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const style = {
    opacity: shouldAnimate ? 1 : 0,
    transform: shouldAnimate ? 'none' : getInitialTransform(animation),
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.23, 1, 0.32, 1)`,
  };

  return <div style={style}>{children}</div>;
}

function getInitialTransform(animation) {
  switch (animation) {
    case 'fade-in-up':
      return 'translateY(30px)';
    case 'fade-in-down':
      return 'translateY(-30px)';
    case 'scale-in':
      return 'scale(0.9)';
    case 'slide-in-left':
      return 'translateX(-30px)';
    case 'slide-in-right':
      return 'translateX(30px)';
    case 'zoom-in':
      return 'scale(0.5)';
    default:
      return 'none';
  }
}
