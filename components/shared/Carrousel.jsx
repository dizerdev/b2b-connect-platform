'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ items }) {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  function next() {
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }

  if (!items || items.length === 0) {
    return <p className='text-gray-500'>Nenhum item disponível.</p>;
  }

  return (
    <div className='relative w-full overflow-hidden'>
      {/* Container */}
      <div
        className='flex transition-transform duration-500 ease-in-out'
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            className='min-w-full flex-shrink-0 p-4 flex justify-center'
          >
            <div className='w-full max-w-sm bg-white rounded-2xl shadow-lg border p-4'>
              <h2 className='text-lg font-bold mb-2'>{item.nome}</h2>
              <p className='text-sm text-gray-600 mb-2'>
                Status: {item.status}
              </p>
              <p className='text-sm text-gray-600 mb-2'>
                Rating: {item.rating || '-'}
              </p>
              <p className='text-sm text-gray-600'>
                Criado em: {new Date(item.criadoEm).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prev}
        className='absolute top-1/2 left-2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100'
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className='absolute top-1/2 right-2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100'
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-2'>
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
