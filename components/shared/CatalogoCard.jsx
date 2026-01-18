'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Star, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Badge from 'components/ui/Badge';
import FavoriteButton from 'components/ui/FavoriteButton';

/**
 * CatalogoCard Component - Premium Design
 * 
 * Features:
 * - Hover zoom on image
 * - Favorite button with animation
 * - Rating stars
 * - Location info
 * - "New" / "Hot" badges
 * - Skeleton loading state
 */

export default function CatalogoCard({
  catalogo,
  compact = false,
  showFavorite = true,
  showLocation = true,
  onFavorite,
  className = '',
}) {
  const t = useTranslations('CatalogoCard');
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(catalogo.id, !isFavorite);
    }
  };

  // Check if catalog is new (less than 7 days old)
  const isNew = catalogo.criado_em
    ? new Date() - new Date(catalogo.criado_em) < 7 * 24 * 60 * 60 * 1000
    : false;

  // Rating display
  const rating = catalogo.rating || 0;
  const fullStars = Math.floor(rating);

  return (
    <Link
      href={catalogo.link || `/dashboard/lojista/vitrines/catalogos/${catalogo.id}`}
      className={`
        group
        block
        bg-white
        rounded-[var(--radius-xl)]
        overflow-hidden
        border border-[var(--color-gray-100)]
        shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-lg)]
        hover:border-[var(--color-primary-200)]
        transition-all duration-300
        ${className}
      `}
    >
      {/* Image Container */}
      <div className={`
        relative overflow-hidden
        ${compact ? 'h-32' : 'h-48'}
        bg-[var(--color-gray-100)]
      `}>
        {/* Skeleton while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-shimmer" />
        )}

        {/* Image */}
        <img
          src={catalogo.imagem_url || catalogo.imagemUrl || '/assets/placeholder.png'}
          alt={catalogo.nome}
          className={`
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-110
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay gradient */}
        <div className="
          absolute inset-0
          bg-gradient-to-t from-black/40 via-transparent to-transparent
          opacity-0 group-hover:opacity-100
          transition-opacity duration-300
        " />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <Badge variant="info" size="sm">
              Novo
            </Badge>
          )}
          {rating >= 4.5 && (
            <Badge variant="warning" size="sm">
              🔥 Em alta
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        {showFavorite && (
          <div className="absolute top-3 right-3">
            <FavoriteButton
              type="catalogo"
              itemId={catalogo.id}
              size="sm"
            />
          </div>
        )}

        {/* Quick view on hover */}
        {!compact && (
          <div className="
            absolute bottom-3 left-1/2 -translate-x-1/2
            opacity-0 group-hover:opacity-100
            transform translate-y-2 group-hover:translate-y-0
            transition-all duration-300
          ">
            <span className="
              inline-flex items-center gap-2
              px-4 py-2
              bg-white/95 backdrop-blur-sm
              rounded-full
              text-sm font-medium
              text-[var(--color-gray-800)]
              shadow-lg
            ">
              <Eye size={14} />
              Ver vitrine
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="
          font-semibold
          text-[var(--color-gray-900)]
          truncate
          group-hover:text-[var(--color-primary-600)]
          transition-colors
        ">
          {catalogo.nome}
        </h3>

        {!compact && (
          <>
            {/* Supplier */}
            {catalogo.fornecedor_nome && (
              <p className="text-sm text-[var(--color-gray-500)] mt-1 truncate">
                🏭 {catalogo.fornecedor_nome}
              </p>
            )}

            {/* Location */}
            {showLocation && catalogo.pais && (
              <p className="
                flex items-center gap-1
                text-sm text-[var(--color-gray-500)]
                mt-1
              ">
                <MapPin size={12} />
                {catalogo.cidade && `${catalogo.cidade}, `}{catalogo.pais}
              </p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= fullStars ? 'var(--color-accent-amber)' : 'none'}
                    stroke={star <= fullStars ? 'var(--color-accent-amber)' : 'var(--color-gray-300)'}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--color-gray-500)]">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Status badge */}
            {catalogo.status && (
              <div className="mt-3">
                <Badge
                  variant={catalogo.status === 'publicado' ? 'success' : 'warning'}
                  size="sm"
                  dot
                >
                  {catalogo.status}
                </Badge>
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
}
