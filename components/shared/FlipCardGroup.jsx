'use client';

import FlipCard from './FlipCard';

export default function FlipCardGroup() {
  // Opcional: podemos passar conteúdo dinâmico depois
  const cards = [
    { front: 'Plano Mensal', back: '$15 por mês' },
    {
      front: 'Plano Anual',
      back: '$150 por 12 meses Economize 20%',
    },
  ];

  return (
    <div className='py-10 bg-gray-800'>
      <h1 className='flex justify-center text-xl font-bold pl-5 text-white'>
        Seja um assinante
      </h1>
      <div className='max-w-6xl mx-auto px-4 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2'>
        {cards.map((card, index) => (
          <FlipCard key={index} front={card.front} back={card.back} />
        ))}
      </div>
      <h3 className='flex justify-center text-lg font-bold pl-5 text-white'>
        Acesso completo à carteira de fabricantes e fornecedores do mundo todo
      </h3>
    </div>
  );
}
