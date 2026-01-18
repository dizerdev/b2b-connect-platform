'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import useOnboardingStore from 'src/store/onboardingStore';
import { Button } from 'components/ui';

/**
 * OnboardingTooltip Component
 * 
 * Displays a tooltip pointing to a target element with navigation controls
 */

export default function OnboardingTooltip() {
  const {
    currentTour,
    isActive,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    getCurrentStep,
  } = useOnboardingStore();

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState('bottom');
  const tooltipRef = useRef(null);

  const currentStep = getCurrentStep();

  useEffect(() => {
    if (!isActive || !currentStep?.target) return;

    const updatePosition = () => {
      const target = document.querySelector(currentStep.target);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight || 200;
      const tooltipWidth = tooltipRef.current?.offsetWidth || 320;
      const padding = 16;
      const arrowSize = 12;

      let top, left, arrow;

      // Calculate best position
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceLeft = rect.left;
      const spaceRight = window.innerWidth - rect.right;

      if (spaceBelow >= tooltipHeight + padding + arrowSize) {
        // Position below
        top = rect.bottom + arrowSize + padding;
        arrow = 'top';
      } else if (spaceAbove >= tooltipHeight + padding + arrowSize) {
        // Position above
        top = rect.top - tooltipHeight - arrowSize - padding;
        arrow = 'bottom';
      } else {
        // Position below anyway
        top = rect.bottom + arrowSize + padding;
        arrow = 'top';
      }

      // Center horizontally relative to target
      left = rect.left + rect.width / 2 - tooltipWidth / 2;

      // Keep within viewport
      if (left < padding) left = padding;
      if (left + tooltipWidth > window.innerWidth - padding) {
        left = window.innerWidth - tooltipWidth - padding;
      }

      setPosition({ top, left });
      setArrowPosition(arrow);

      // Highlight target element
      target.style.position = 'relative';
      target.style.zIndex = '1001';
      target.style.boxShadow = '0 0 0 4px var(--color-primary-400), 0 0 0 8px rgba(180, 130, 100, 0.2)';
      target.style.borderRadius = '8px';
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      // Clean up highlight
      const target = document.querySelector(currentStep.target);
      if (target) {
        target.style.position = '';
        target.style.zIndex = '';
        target.style.boxShadow = '';
        target.style.borderRadius = '';
      }
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isActive]);

  if (!isActive || !currentTour || !currentStep) return null;

  const isFirstStep = currentTour.currentStep === 0;
  const isLastStep = currentTour.currentStep === currentTour.steps.length - 1;
  const progress = ((currentTour.currentStep + 1) / currentTour.steps.length) * 100;

  const tooltipContent = (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-[1000]" onClick={skipTour} />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="
          fixed z-[1002]
          w-80 max-w-[calc(100vw-32px)]
          bg-white
          rounded-[var(--radius-xl)]
          shadow-[var(--shadow-2xl)]
          animate-fade-in-up
        "
        style={{
          top: position.top,
          left: position.left,
        }}
      >
        {/* Arrow */}
        <div
          className={`
            absolute w-4 h-4
            bg-white
            rotate-45
            ${arrowPosition === 'top' ? '-top-2 left-1/2 -translate-x-1/2' : ''}
            ${arrowPosition === 'bottom' ? '-bottom-2 left-1/2 -translate-x-1/2' : ''}
          `}
        />

        {/* Progress bar */}
        <div className="h-1 bg-[var(--color-gray-100)] rounded-t-[var(--radius-xl)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary-400)] to-[var(--color-primary-600)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-[var(--color-primary-600)]">
                Passo {currentTour.currentStep + 1} de {currentTour.steps.length}
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-gray-900)] mt-1">
                {currentStep.title}
              </h3>
            </div>
            <button
              onClick={skipTour}
              className="p-1 rounded-lg text-[var(--color-gray-400)] hover:bg-[var(--color-gray-50)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--color-gray-600)] leading-relaxed mb-5">
            {currentStep.description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={skipTour}
              className="text-sm text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)] transition-colors"
            >
              Pular tour
            </button>

            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevStep}
                  icon={ChevronLeft}
                >
                  Anterior
                </Button>
              )}

              {isLastStep ? (
                <Button
                  size="sm"
                  onClick={completeTour}
                  icon={Check}
                >
                  Concluir
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={nextStep}
                  iconPosition="right"
                  icon={ChevronRight}
                >
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Use portal to render at document root
  if (typeof window === 'undefined') return null;
  return createPortal(tooltipContent, document.body);
}
