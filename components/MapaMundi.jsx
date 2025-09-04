'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MapaMundi({ parceiros }) {
  return (
    <div
      className='
        relative
        justify-items-center 
        xl:h-[73vh]
        w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[90vw]
        aspect-[2/1] 
        border border-gray-300 rounded-lg overflow-hidden shadow-lg
      '
    >
      {/* Fundo do mapa */}
      <Image
        src='/assets/mapashoesnetworld.jpg'
        alt='Mapa Mundi'
        fill
        className='object-cover'
        priority
      />

      {/* Ícones dos parceiros */}
      {parceiros.map((p, i) => (
        <div
          key={i}
          title={p.nome}
          className='absolute -translate-x-1/2 -translate-y-1/2'
          style={{
            left: p.x,
            top: p.y,
          }}
        >
          <Link
            href={p.href || '#'}
            className='group flex flex-col items-center'
          >
            {/* Ícone */}
            <img
              src='/icons/ping.svg'
              alt='Globo'
              width={24}
              height={42}
              className='
                text-white-100 
                hover:text-blue-400 
                hover:brightness-200 
                hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)]
                transition-all cursor-pointer
              '
            />

            {/* Tooltip com nome */}
            <span
              className='
                mt-1 px-2 py-1 rounded-lg text-xs font-semibold
                bg-gray-900 text-white opacity-0 scale-90
                group-hover:opacity-100 group-hover:scale-100
                group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,1)]
                transition-all duration-300
              '
            >
              {p.nome}
            </span>
          </Link>
        </div>
      ))}
    </div>
  );
}
