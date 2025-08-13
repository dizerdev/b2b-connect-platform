'use client';

import Image from 'next/image';
import { Globe2 } from 'lucide-react'; // Ícone para representar países parceiros

export default function MapaMundi({ parceiros }) {
  return (
    <div
      className='
        relative
        items-center 
        xl:h-[73vh]
        w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[90vw]
        aspect-[2/1] 
        border border-gray-300 rounded-lg overflow-hidden shadow-lg
      '
    >
      {/* Fundo do mapa */}
      <Image
        src='/assets/mapamundi_shoesnetworld.jpg'
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
          className='absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group'
          style={{
            left: p.x,
            top: p.y,
          }}
        >
          <Globe2 className='text-blue-600 group-hover:shadow-xl shadow-blue-100 text-blue-800 transition-colors w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ' />
        </div>
      ))}
    </div>
  );
}
