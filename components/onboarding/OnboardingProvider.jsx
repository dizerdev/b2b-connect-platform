'use client';

import { OnboardingTooltip } from 'components/onboarding';

/**
 * OnboardingProvider - Client Component Wrapper
 * 
 * Renders the OnboardingTooltip at the root level
 */
export default function OnboardingProvider({ children }) {
  return (
    <>
      {children}
      <OnboardingTooltip />
    </>
  );
}
