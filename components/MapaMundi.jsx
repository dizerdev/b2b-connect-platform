'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

/**
 * MapaMundi Component - Premium Design
 * 
 * Features:
 * - Enhanced pins with glow effect
 * - Animated tooltips
 * - Responsive sizing
 * - Subtle parallax-like effect on hover
 */

export default function MapaMundi({ parceiros, className = '' }) {
  return (
    <div
      className={`
        relative
        w-full max-w-6xl mx-auto
        aspect-[2/1]
        rounded-[var(--radius-2xl)]
        overflow-hidden
        shadow-[var(--shadow-xl)]
        border border-[var(--color-gray-200)]
        bg-[var(--color-gray-100)]
        group/map
        ${className}
      `}
    >
      {/* Map Background with subtle animation */}
      <div className="
        absolute inset-0
        transition-transform duration-700 ease-out
        group-hover/map:scale-[1.02]
      ">
        <Image
          src="/assets/mapashoesnetworld.jpg"
          alt="Mapa Mundi"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay gradient for depth */}
        <div className="
          absolute inset-0
          bg-gradient-to-b from-transparent via-transparent to-black/20
          pointer-events-none
        " />
      </div>

      {/* Partner Pins */}
      {parceiros.map((partner, index) => (
        <div
          key={index}
          className="
            absolute
            -translate-x-1/2 -translate-y-1/2
            z-10
          "
          style={{
            left: partner.x,
            top: partner.y,
          }}
        >
          <Link
            href={partner.href || '#'}
            className="
              group/pin
              flex flex-col items-center
              cursor-pointer
            "
          >
            {/* Pin with glow effect */}
            <div className="
              relative
              transition-transform duration-300
              group-hover/pin:scale-125
              group-hover/pin:-translate-y-1
            ">
              {/* Glow pulse */}
              <div className="
                absolute inset-0
                w-6 h-6
                -translate-x-1 -translate-y-1
                rounded-full
                bg-[var(--color-accent-blue)]
                opacity-0
                group-hover/pin:opacity-40
                group-hover/pin:animate-ping
                transition-opacity
              " />
              
              {/* Pin icon */}
              <div className="
                relative
                w-6 h-6
                flex items-center justify-center
              ">
                <MapPin
                  size={24}
                  className="
                    text-[var(--color-accent-blue)]
                    drop-shadow-lg
                    transition-colors duration-300
                    group-hover/pin:text-[var(--color-primary-500)]
                  "
                  fill="currentColor"
                  strokeWidth={1}
                  stroke="white"
                />
              </div>
            </div>

            {/* Tooltip */}
            <div className="
              absolute -bottom-10 left-1/2 -translate-x-1/2
              px-3 py-1.5
              bg-[var(--color-gray-900)]
              text-white
              text-xs font-medium
              rounded-[var(--radius-lg)]
              whitespace-nowrap
              opacity-0 scale-90
              transform translate-y-2
              group-hover/pin:opacity-100
              group-hover/pin:scale-100
              group-hover/pin:translate-y-0
              transition-all duration-300
              shadow-lg
              z-20
            ">
              {partner.nome}
              {/* Arrow */}
              <div className="
                absolute -top-1 left-1/2 -translate-x-1/2
                w-2 h-2
                bg-[var(--color-gray-900)]
                rotate-45
              " />
            </div>
          </Link>
        </div>
      ))}

      {/* Decorative corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/30 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 rounded-br-lg" />
    </div>
  );
}
