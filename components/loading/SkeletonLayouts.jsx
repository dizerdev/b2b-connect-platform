'use client';

/**
 * SkeletonLayouts - Pre-built skeleton screens for common layouts
 * 
 * Features:
 * - Dashboard layout skeleton
 * - Card grid skeleton
 * - Table skeleton
 * - Profile skeleton
 */

// Dashboard skeleton with sidebar and cards
export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-[var(--color-gray-50)]">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-white border-r border-[var(--color-gray-100)] p-4 hidden lg:block">
        <div className="skeleton h-10 w-32 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-[var(--color-gray-100)]">
              <div className="flex items-start justify-between">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="skeleton w-16 h-8" />
              </div>
              <div className="skeleton h-4 w-24 mt-4" />
              <div className="skeleton h-8 w-16 mt-2" />
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[var(--color-gray-100)]">
            <div className="skeleton h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="skeleton w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-3/4 mb-2" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                  <div className="skeleton h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[var(--color-gray-100)]">
            <div className="skeleton h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-gray-50)]">
                  <div className="skeleton w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-full mb-1" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Card grid skeleton
export function CardGridSkeleton({ count = 6, columns = 3 }) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden border border-[var(--color-gray-100)]"
        >
          <div className="skeleton h-48 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="flex items-center justify-between pt-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-gray-100)] overflow-hidden">
      {/* Header */}
      <div className="border-b border-[var(--color-gray-100)] p-4 bg-[var(--color-gray-50)]">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[var(--color-gray-100)]">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, col) => (
              <div key={col} className="skeleton h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[var(--color-gray-100)]">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="skeleton w-24 h-24 rounded-full" />

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-4 w-64" />
          
          <div className="flex gap-4 pt-4">
            <div className="skeleton h-10 w-28 rounded-lg" />
            <div className="skeleton h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[var(--color-gray-100)]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="skeleton h-8 w-16 mx-auto mb-2" />
            <div className="skeleton h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  Dashboard: DashboardSkeleton,
  CardGrid: CardGridSkeleton,
  Table: TableSkeleton,
  Profile: ProfileSkeleton,
};
