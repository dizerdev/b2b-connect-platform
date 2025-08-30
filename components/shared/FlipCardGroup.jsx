'use client';

import FlipCard from './FlipCard';

export default function FlipCardGroup() {
  // Opcional: podemos passar conteúdo dinâmico depois
  const cards = [
    { front: 'Footwear & Components', back: 'Back 1' },
    { front: 'Leathers', back: 'Back 2' },
    { front: 'Accessories', back: 'Back 3' },
    { front: 'Machines & Chemicals', back: 'Back 3' },
  ];

  return (
    <div className='py-10 bg-gray-800'>
      <div className='max-w-6xl mx-auto px-4 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
        {cards.map((card, index) => (
          <FlipCard key={index} front={card.front} back={card.back} />
        ))}
      </div>
    </div>
  );
}
