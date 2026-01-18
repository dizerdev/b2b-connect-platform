'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import useFavoritesStore from 'src/store/favoritesStore';

/**
 * FavoriteButton Component
 * 
 * Animated heart button for favoriting items
 * Features: Optimistic updates, pulse animation, sync with store
 */

export default function FavoriteButton({
  type = 'catalogo', // 'catalogo' | 'produto'
  itemId,
  size = 'md',
  showLabel = false,
  className = '',
}) {
  const { isFavorite, toggleFavorite, syncFromAPI, synced } = useFavoritesStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const isFav = isFavorite(type, itemId);

  // Sync from API on first load
  useEffect(() => {
    if (!synced) {
      syncFromAPI();
    }
  }, [synced, syncFromAPI]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    await toggleFavorite(type, itemId);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizes = {
    sm: {
      button: 'w-7 h-7',
      icon: 14,
    },
    md: {
      button: 'w-9 h-9',
      icon: 18,
    },
    lg: {
      button: 'w-11 h-11',
      icon: 22,
    },
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeConfig.button}
        flex items-center justify-center gap-2
        rounded-full
        bg-white/90 backdrop-blur-sm
        shadow-md
        border border-transparent
        transition-all duration-300
        hover:scale-110 hover:shadow-lg
        active:scale-95
        group
        ${isFav 
          ? 'text-[var(--color-accent-rose)] border-[var(--color-accent-rose)]/20' 
          : 'text-[var(--color-gray-400)] hover:text-[var(--color-accent-rose)]'
        }
        ${isAnimating ? 'animate-pulse' : ''}
        ${className}
      `}
      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        size={sizeConfig.icon}
        fill={isFav ? 'currentColor' : 'none'}
        className={`
          transition-all duration-300
          ${isAnimating ? 'scale-125' : ''}
          ${isFav ? '' : 'group-hover:scale-110'}
        `}
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {isFav ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </button>
  );
}
