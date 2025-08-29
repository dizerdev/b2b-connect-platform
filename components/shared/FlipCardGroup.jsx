'use client';

import FlipCard from './FlipCard';

export default function FlipCardGroup() {
  // Opcional: podemos passar conteúdo dinâmico depois
  const cards = [
    { front: 'Front 1', back: 'Back 1' },
    { front: 'Front 2', back: 'Back 2' },
    { front: 'Front 3', back: 'Back 3' },
  ];

  return (
    <div className='py-10 bg-gray-800'>
      <div className='max-w-6xl mx-auto px-4 grid gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3'>
        {cards.map((card, index) => (
          <FlipCard key={index} front={card.front} back={card.back} />
        ))}
      </div>
    </div>
  );
}
