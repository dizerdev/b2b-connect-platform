'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CatalogoCard from 'components/shared/CatalogoCard';
import Skeleton from 'components/ui/Skeleton';

/**
 * Section Component - Premium Design
 * 
 * Features:
 * - Animated title with gradient
 * - See more link with arrow
 * - Grid layout with responsive columns
 * - Skeleton loading state
 * - Empty state handling
 */

export default function Section({
  title,
  data,
  filter,
  icon,
  loading = false,
  maxItems = 4,
  showFavorite = true,
  className = '',
}) {
  const t = useTranslations('Section');

  // Don't render if no data and not loading
  if (!loading && (!data || data.length === 0)) return null;

  return (
    <section className={`py-8 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="
              w-10 h-10
              flex items-center justify-center
              rounded-[var(--radius-lg)]
              bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)]
              text-[var(--color-primary-600)]
            ">
              {icon}
            </div>
          )}
          <h2 className="
            text-xl font-heading font-bold
            text-[var(--color-gray-900)]
          ">
            {title}
          </h2>
        </div>

        {filter && (
          <Link
            href={`/dashboard/lojista/vitrines/principal?${filter}`}
            className="
              group
              flex items-center gap-2
              text-sm font-medium
              text-[var(--color-primary-600)]
              hover:text-[var(--color-primary-700)]
              transition-colors
            "
          >
            {t('SeeMore')}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Skeleton loading
          Array.from({ length: maxItems }).map((_, index) => (
            <Skeleton.Card key={index} showImage lines={2} />
          ))
        ) : (
          // Actual cards
          data.slice(0, maxItems).map((catalogo) => (
            <CatalogoCard
              key={catalogo.id}
              catalogo={catalogo}
              showFavorite={showFavorite}
            />
          ))
        )}
      </div>
    </section>
  );
}
