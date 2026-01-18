'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * CountUp Component - Animated number counter
 * 
 * Features:
 * - Smooth easing
 * - Scroll-triggered
 * - Customizable duration and format
 */

export default function CountUp({
  end,
  start = 0,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = '.',
  triggerOnScroll = true,
  threshold = 0.5,
  className = '',
}) {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(!triggerOnScroll);
  const ref = useRef(null);

  useEffect(() => {
    if (!triggerOnScroll) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [triggerOnScroll, threshold]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out-expo)
      const eased = 1 - Math.pow(2, -10 * progress);
      
      const currentValue = start + (end - start) * eased;
      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasStarted, start, end, duration]);

  const formatNumber = (num) => {
    const fixed = num.toFixed(decimals);
    const [integer, decimal] = fixed.split('.');
    const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimal ? `${formatted},${decimal}` : formatted;
  };

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
}
