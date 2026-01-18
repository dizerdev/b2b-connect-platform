'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import SparklineChart from 'components/charts/SparklineChart';

/**
 * MetricCard Component
 * 
 * Premium metric card with sparkline, trend indicator, and animations
 */

const colorSchemes = {
  blue: {
    icon: 'bg-blue-100 text-blue-600',
    chart: 'var(--color-accent-blue)',
    trendUp: 'text-emerald-600 bg-emerald-50',
    trendDown: 'text-rose-600 bg-rose-50',
  },
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600',
    chart: 'var(--color-accent-emerald)',
    trendUp: 'text-emerald-600 bg-emerald-50',
    trendDown: 'text-rose-600 bg-rose-50',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600',
    chart: 'var(--color-accent-amber)',
    trendUp: 'text-emerald-600 bg-emerald-50',
    trendDown: 'text-rose-600 bg-rose-50',
  },
  rose: {
    icon: 'bg-rose-100 text-rose-600',
    chart: 'var(--color-accent-rose)',
    trendUp: 'text-emerald-600 bg-emerald-50',
    trendDown: 'text-rose-600 bg-rose-50',
  },
  primary: {
    icon: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
    chart: 'var(--color-primary-500)',
    trendUp: 'text-emerald-600 bg-emerald-50',
    trendDown: 'text-rose-600 bg-rose-50',
  },
};

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  sparklineData,
  color = 'blue',
  loading = false,
  className = '',
}) {
  const scheme = colorSchemes[color] || colorSchemes.blue;
  
  // Determine trend direction
  const trendDirection = trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';
  const TrendIcon = trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className={`
        bg-white rounded-[var(--radius-xl)] p-5
        border border-[var(--color-gray-100)]
        shadow-[var(--shadow-sm)]
        animate-pulse
        ${className}
      `}>
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-gray-200)]" />
          <div className="w-20 h-8 rounded bg-[var(--color-gray-200)]" />
        </div>
        <div className="w-24 h-4 rounded bg-[var(--color-gray-200)] mb-2" />
        <div className="w-16 h-8 rounded bg-[var(--color-gray-200)]" />
      </div>
    );
  }

  return (
    <div className={`
      bg-white rounded-[var(--radius-xl)] p-5
      border border-[var(--color-gray-100)]
      shadow-[var(--shadow-sm)]
      hover:shadow-[var(--shadow-md)]
      hover:border-[var(--color-gray-200)]
      transition-all duration-300
      group
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className={`
          w-10 h-10
          flex items-center justify-center
          rounded-lg
          ${scheme.icon}
          transition-transform duration-300
          group-hover:scale-110
        `}>
          {Icon && <Icon size={20} />}
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <SparklineChart
            data={sparklineData}
            width={80}
            height={32}
            color={scheme.chart}
          />
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-[var(--color-gray-500)] mb-1">
        {title}
      </p>

      {/* Value and Trend */}
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-[var(--color-gray-900)]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>

        {trend !== undefined && (
          <div className={`
            flex items-center gap-1
            px-2 py-1
            rounded-full
            text-xs font-medium
            ${trendDirection === 'up' ? scheme.trendUp : ''}
            ${trendDirection === 'down' ? scheme.trendDown : 'text-gray-500 bg-gray-50'}
          `}>
            <TrendIcon size={12} />
            <span>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>

      {/* Trend Label */}
      {trendLabel && (
        <p className="text-xs text-[var(--color-gray-400)] mt-2">
          {trendLabel}
        </p>
      )}
    </div>
  );
}
